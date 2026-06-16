import {useCallback, useEffect, useRef, useState} from "react";
import type AppModel from "../apps/AppModel.ts";
import type {AppProps} from "../apps/AppModel.ts";
import RunningApp from "./RunningApp.tsx";
import Startup from "../apps/Startup.tsx";
import {DragDropProvider} from "@dnd-kit/react";
import {produce} from "immer";
import "./OS.css";
import SlowLoad from "./SlowLoad.tsx";
import Logo from "../assets/img/g-os-bare.svg";
import AppRegistry from "../AppRegistry.ts";
import BootState, {INITIAL_BOOT_STATE} from "../types/BootState.ts";
import {layout, measureLineStats, prepareWithSegments} from "@chenglou/pretext";
import Error from "../apps/Error.tsx";
import DefaultAppIcon from "../assets/img/windows98-icons/ico/executable.ico";
import DesktopIcon from "./DesktopIcon.tsx";
import {RestrictToElement} from '@dnd-kit/dom/modifiers';
import {Feedback} from '@dnd-kit/dom';
import TaskbarWindow from "./TaskbarWindow.tsx";
import type {AppPos} from "../types/RunningApp.ts";
import type RunningAppModel from "../types/RunningApp.ts";
import {AppState} from "../types/RunningApp.ts";

const DESKTOP_LOAD_START = 6000;
// How far to shift the window down and to the right when launching an app and the top left corner is too close to another windows top left corner
const WINDOW_OVERLAP_SHIFT_INTERVAL = 50;
// How close one windows top left corner can be to another windows top left corner on launch before shifting
const WINDOW_OVERLAP_MARGIN = 10;
const STARTUP_APP_SIZE = 100;

const OS = () => {
    const currentId = useRef(0);
    const [time, setTime] = useState("");
    const [runningApps, setRunningApps] = useState<RunningAppModel[]>([]);
    const dragAreaRef = useRef<HTMLDivElement>(null);
    const [windowStackingOrder, setWindowStackingOrder] = useState<number[]>([]);
    const [focusedWindow, setFocusedWindow] = useState<number>(-1);
    const [showStartMenu, setShowStartMenu] = useState(false);
    const [startMenuSize, setStartMenuSize] = useState(0);

    // isTechnicalError can be set to false to show "vanity" errors for easter eggs and such that are not actually issues
    const showError = useCallback((message: string, isTechnicalError: boolean = true) => {
        const MAX_ERROR_WIDTH = 500;

        if (isTechnicalError) {
            console.error(message)
        }

        const bodyTextHandle = prepareWithSegments(message, `"Pixelated MS Sans Serif",Arial`);

        const bodyTextLayout = layout(bodyTextHandle, MAX_ERROR_WIDTH, 1.2); // see Error.css, todo dont use magic number here

        const bodyLineStats = measureLineStats(bodyTextHandle, MAX_ERROR_WIDTH);

        const height = 100 + bodyTextLayout.height;
        const topPos = (dragAreaRef.current!.clientHeight / 2) - (height / 2);

        const width = 150 + bodyLineStats.maxLineWidth;
        const leftPos = (dragAreaRef.current!.clientWidth / 2) - (width / 2);

        runApp(Error, {
            top: topPos,
            bottom: topPos + height,
            left: leftPos,
            right: leftPos + width
        }, {
            message, bodyLayout: {
                height: bodyTextLayout.height,
                width: bodyLineStats.maxLineWidth
            }
        })
    }, [])

    const findNextWindowStartPosition = (windowHeight: number, windowWidth: number) => {
        const maxWidth = dragAreaRef.current!.clientWidth - (windowWidth + WINDOW_OVERLAP_SHIFT_INTERVAL);
        const maxHeight = dragAreaRef.current!.clientHeight - (windowHeight + WINDOW_OVERLAP_SHIFT_INTERVAL);

        const result = {
            vertical: WINDOW_OVERLAP_SHIFT_INTERVAL,
            horizontal: WINDOW_OVERLAP_SHIFT_INTERVAL
        };

        let column = 1;

        const newColumnPos = () => WINDOW_OVERLAP_SHIFT_INTERVAL + (column * 10); // The vertical shift on wrap is not authentic but the real way 98 handles this is lame and this feels "correct", some mandela effect stuff I guess
        const willVerticalShiftPushWindowOutsideDragArea = () => newColumnPos() > maxHeight;

        let collidingWindows = 0;

        while (result.vertical <= maxHeight || (result.horizontal <= maxWidth && !willVerticalShiftPushWindowOutsideDragArea())) {
            if (runningApps.some(app => Math.abs(app.pos.top - result.vertical) < WINDOW_OVERLAP_MARGIN && Math.abs(app.pos.left - result.horizontal) < WINDOW_OVERLAP_MARGIN)) {
                if (result.vertical >= maxHeight) {
                    column++;
                    result.vertical = newColumnPos();
                    result.horizontal = column * WINDOW_OVERLAP_SHIFT_INTERVAL;
                } else {
                    result.vertical += WINDOW_OVERLAP_SHIFT_INTERVAL;
                    result.horizontal += WINDOW_OVERLAP_SHIFT_INTERVAL;
                }
                collidingWindows++;
            } else {
                return result;
            }
        }

        // I wanted a funny error (just "stop") if you spam open an app, but this can also occur e.g. if the real browser window is really small. I decided if it had to maneuver around more then 20 windows, the user is spamming an app
        if (collidingWindows > 20) {
            showError("stop", false);
        } else {
            showError("No room for another window!", false);
        }
    };

    const closeApp = useCallback((app: number) => {
        setRunningApps(prev => {
            const index = prev.findIndex(runningApp => runningApp.id === app);
            if (index === -1) return prev;
            return [...prev.slice(0, index), ...prev.slice(index + 1)];
        });
    }, []);

    // See RunningAppModel interface for explanation of any being used here
    const runApp = useCallback(<P extends AppProps = AppProps>(app: AppModel<P>, pos?: AppPos, appArgs?: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
        if (!pos) {
            const newPos = findNextWindowStartPosition(app.initialHeight, app.initialWidth);

            if (newPos == null) {
                return -1;
            }

            pos = {
                top: newPos.vertical,
                left: newPos.horizontal,
                bottom: newPos.vertical + app.initialHeight,
                right: newPos.horizontal + app.initialWidth
            }
        }

        const newAppId = ++currentId.current;

        setWindowStackingOrder(prev => [...prev, newAppId]);

        setRunningApps(prev => {
            if (app.singleInstance && prev.some(x => x.app.identifier === app.identifier)) {
                return prev;
            }

            return [
                ...prev,
                {
                    app,
                    id: newAppId,
                    pos,
                    appArgs: appArgs as AppProps,
                    appState: AppState.Open
                }
            ];
        });

        setFocusedWindow(newAppId);

        return newAppId;
    }, [closeApp, findNextWindowStartPosition]);

    const focusApp = useCallback((appId: number) => {
        setWindowStackingOrder(prev => [...prev.filter(x => x !== appId), appId]);
        setFocusedWindow(appId);
    }, []);

    useEffect(() => {
        if (INITIAL_BOOT_STATE === BootState.BIOS) showError('This site is very WIP. Most stuff does not work yet. You have been warned', false);

        let startupWindowId = -1;

        const windowTimeout = setTimeout(() => {
            if (INITIAL_BOOT_STATE !== BootState.BIOS) return;
            startupWindowId = runApp(Startup, {
                top: window.innerHeight / 2 - STARTUP_APP_SIZE,
                left: window.innerWidth / 2 - STARTUP_APP_SIZE,
                bottom: window.innerHeight / 2 + STARTUP_APP_SIZE,
                right: window.innerWidth / 2 + STARTUP_APP_SIZE
            });
        }, 500);

        const loadingTimeout = setTimeout(() => {
            if (INITIAL_BOOT_STATE !== BootState.BIOS) return;
            closeApp(startupWindowId);
        }, 5500);

        const clockInterval = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }));
        }, 1000);

        return () => {
            clearTimeout(windowTimeout);
            clearTimeout(loadingTimeout);
            clearInterval(clockInterval);
        };
    }, []);

    const updateRunningApp = useCallback((app: number, producer: (draft: RunningAppModel) => void) => {
        setRunningApps(prev => produce(prev, draft => {
            const index = draft.findIndex(runningApp => runningApp.id === app);
            producer(draft[index]);
        }));
    }, []);

    const setAppState = (id: number, state: AppState) => updateRunningApp(id, (draft) => draft.appState = state);

    useEffect(() => {
        if (!showStartMenu) return;
        const frame = requestAnimationFrame(() => setStartMenuSize(500));
        return () => cancelAnimationFrame(frame);
    }, [showStartMenu]);

    useEffect(() => {
        const handleBlur = () => {
            // I really tried to find a less ugly way to do this but animation frames didnt work consistently enough
            setTimeout(() => {
                const active = document.activeElement;
                console.log(active)
                if (active?.tagName.toLowerCase() === "iframe") {
                    focusApp(parseInt(active.closest(".window")!.id!.split("-")[1]));
                }
            }, 100);
        }

        window.addEventListener("blur", handleBlur);

        return () => window.removeEventListener("blur", handleBlur);
    }, [focusApp]);

    useEffect(() => {
        let timer: number;
        window.addEventListener('resize', () => {
            clearTimeout(timer);
            timer = setTimeout(() => { // Debounce
                setRunningApps(prev =>
                    produce(prev, draft => {
                        draft.forEach(app => {
                            if (app.pos.bottom > dragAreaRef.current!.clientHeight) {
                                const height = app.pos.bottom - app.pos.top;
                                app.pos.top = Math.max(dragAreaRef.current!.clientHeight - height, 0);
                                app.pos.bottom = dragAreaRef.current!.clientHeight;
                            }
                            if (app.pos.right > dragAreaRef.current!.clientWidth) {
                                const width = app.pos.right - app.pos.left;
                                app.pos.left = Math.max(dragAreaRef.current!.clientWidth - width, 0);
                                app.pos.right = dragAreaRef.current!.clientWidth;
                            }
                        });
                    })
                )
            }, 50);
        });
    }, [runningApps, updateRunningApp]);

    return (
        <div id="OS">
            <div id="drag-area" ref={dragAreaRef} onClick={(e) => {
                if (e.target === dragAreaRef.current) {
                    setFocusedWindow(-1);
                }
            }}>
                <DragDropProvider modifiers={[RestrictToElement.configure({element: dragAreaRef.current})]}
                                  onBeforeDragStart={(event) => {
                                      if (event.operation.source?.element?.className === "window") {
                                          const appId = parseInt(event.operation.source?.id.toString().replace("window-", ""));
                                          const app = runningApps.find(x => x.id === appId);
                                          const rect = event.operation.source?.element?.getBoundingClientRect();
                                          if (!app) return;
                                          if (app.appState === AppState.Maximized) {
                                              const pos = event.operation.position.current;
                                              updateRunningApp(appId, (draft) => {
                                                  if (dragAreaRef.current === null) return;
                                                  draft.appState = AppState.Open;

                                                  // the idea is to restore the window to the old dimensions, and put it in the same position relative to the cursor horizontally
                                                  const offset = (pos.x - rect.left) / rect.width;
                                                  const restoredWidth = app.pos.right - app.pos.left;

                                                  draft.pos.left = pos.x - (restoredWidth * offset);
                                                  draft.pos.right = draft.pos.left + restoredWidth;

                                                  draft.pos.top = pos.y - 10;
                                                  draft.pos.bottom = draft.pos.top + (app.pos.bottom - app.pos.top);
                                              })
                                          }
                                          focusApp(appId);
                                      }
                                  }}
                    // use the `move` strategy so the contents dont remount on drop
                                  plugins={(defaults) => [...defaults, Feedback.configure({feedback: 'move'})]}
                                  onDragEnd={(event) => {
                                      const resultRect = event.operation.source?.element?.getBoundingClientRect();
                                      if (!resultRect || resultRect.height == 0) return; // Likely the element was removed, e.g. user was dragging a window that closed, e.g. user was dragging the startup window when the sequence advanced
                                      switch (event.operation.source?.element?.className) {
                                          case "window":
                                              updateRunningApp(event.operation.source?.id as number, (draft) => {
                                                  draft.pos = {
                                                      top: resultRect?.top ?? 0,
                                                      left: resultRect?.left ?? 0,
                                                      bottom: resultRect?.bottom ?? 0,
                                                      right: resultRect?.right ?? 0,
                                                  }
                                              });
                                              break;
                                          default:
                                              console.error("Unknown element class name: " + event.operation.source?.element?.className) // TODO: error window for this?
                                              break;
                                      }
                                  }}
                >
                    <SlowLoad duration={DESKTOP_LOAD_START}>
                        <div id="desktop">
                            {AppRegistry.filter(x => !x.isHidden).map(app => (
                                <SlowLoad key={app.identifier}>
                                    <DesktopIcon icon={app.icon ?? DefaultAppIcon} name={app.name} key={app.identifier}
                                                 open={() => runApp(app)}/>
                                </SlowLoad>
                            ))}
                        </div>
                    </SlowLoad>
                    {runningApps.map((runningApp) => <RunningApp
                            focused={focusedWindow === runningApp.id}
                            key={runningApp.id}
                            app={runningApp.app}
                            id={runningApp.id}
                            pos={runningApp.pos}
                            setPos={(pos) => updateRunningApp(runningApp.id, (draft) => draft.pos = {
                                left: Math.max(pos.left, 0),
                                top: Math.max(pos.top, 0),
                                bottom: Math.min(pos.bottom, dragAreaRef.current!.clientHeight),
                                right: Math.min(pos.right, dragAreaRef.current!.clientWidth)
                            })}
                            appArgs={runningApp.appArgs}
                            close={() => closeApp(runningApp.id)}
                            focus={() => focusApp(runningApp.id)}
                            zIndex={windowStackingOrder.indexOf(runningApp.id)}
                            appState={runningApp.appState}
                            setAppState={(state) => {
                                setAppState(runningApp.id, state)
                            }}
                        />
                    )}
                </DragDropProvider>
            </div>
            <SlowLoad duration={DESKTOP_LOAD_START}>
                <div id="taskbar">
                    <SlowLoad>
                        <button className="taskbar-button" onClick={() => {
                            if (showStartMenu) {
                                setStartMenuSize(0);
                            } else {
                                setShowStartMenu(true);
                            }
                        }}>
                            <img id="logo" src={Logo} alt=""/>
                            <b>Start</b>
                        </button>
                    </SlowLoad>
                    <div className="divider-1"></div>
                    <div className="divider-2"></div>
                    <div style={{width: 100}}/>
                    <div className="divider-1"></div>
                    <div className="divider-2"></div>
                    {runningApps.map(x => <TaskbarWindow focused={focusedWindow === x.id} key={x.id}
                                                         icon={x.app.labelIcon ?? x.app.icon}
                                                         name={x.app.label ?? x.app.name}
                                                         focusApp={() => focusApp(x.id)}/>)}
                    <div id="taskbar-right">
                        <div className="divider-1"></div>
                        <div className="status-field-border" id="status-menu">
                            <SlowLoad><p id="clock">{time}</p></SlowLoad>
                        </div>
                    </div>
                </div>
            </SlowLoad>
            {/*The start menu has the same styling as a button so just hijack the 98.css button styles*/}
            {showStartMenu && (
                <button id="start-menu" disabled style={{height: startMenuSize}}
                        onTransitionEnd={() => {
                            if (startMenuSize === 0) {
                                setShowStartMenu(false);
                            }
                        }}
                >
                </button>
            )}
        </div>
    )
}

export default OS;
