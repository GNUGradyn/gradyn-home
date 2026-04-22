import {useCallback, useEffect, useRef, useState} from "react";
import type AppModel from "../apps/AppModel.ts";
import RunningApp from "./RunningApp.tsx";
import Startup from "../apps/Startup.tsx";
import {DragDropProvider} from "@dnd-kit/react";
import {produce} from "immer";
import "./OS.css";
import SlowLoad from "./SlowLoad.tsx";
import Logo from "../assets/img/g-os-bare.svg";
import AppRegistry from "../AppRegistry.ts";
import BootState, {INITIAL_BOOT_STATE} from "../models/BootState.ts";

const DESKTOP_LOAD_START = 6000;
// How far to shift the window down and to the right when launching an app and the top left corner is too close to another windows top left corner
const WINDOW_OVERLAP_SHIFT_INTERVAL = 50;
// How close one windows top left corner can be to another windows top left corner on launch before shifting
const WINDOW_OVERLAP_MARGIN = 10;
const STARTUP_APP_SIZE = 100;

interface OsProps {
    isBooted: boolean;
    skipBoot: () => void;
}

interface RunningApp {
    app: AppModel;
    id: number;
    pos: AppPos;
}

export interface AppPos {
    top: number;
    bottom: number;
    left: number;
    right: number;
}


const OS = (props: OsProps) => {
    const currentId = useRef(0);
    const [time, setTime] = useState("");
    const [runningApps, setRunningApps] = useState<RunningApp[]>([]);
    const dragAreaRef = useRef<HTMLDivElement>(null);

    const showError = useCallback((message: string) => {

    })

    const findNextWindowStartPosition = (windowHeight: number, windowWidth: number) => {
        const maxWidth = dragAreaRef.current!.clientWidth - (windowWidth + + WINDOW_OVERLAP_SHIFT_INTERVAL);
        const maxHeight = dragAreaRef.current!.clientHeight - (windowHeight + WINDOW_OVERLAP_SHIFT_INTERVAL);

        const result = {
            vertical: WINDOW_OVERLAP_SHIFT_INTERVAL,
            horizontal: WINDOW_OVERLAP_SHIFT_INTERVAL
        };

        let column = 1;

        while (result.vertical <= maxHeight || result.horizontal <= maxWidth) {
            if (runningApps.some(app => Math.abs(app.pos.top - result.vertical) < WINDOW_OVERLAP_MARGIN && Math.abs(app.pos.left - result.horizontal) < WINDOW_OVERLAP_MARGIN)) {
                if (result.vertical >= maxHeight) {
                    column++;
                    result.vertical = WINDOW_OVERLAP_SHIFT_INTERVAL + (column * 10); // The vertical shift on wrap is not authentic but the real way 98 handles this is lame and this feels "correct", some mandela effect stuff I guess
                    result.horizontal = column * WINDOW_OVERLAP_SHIFT_INTERVAL;
                } else {
                    result.vertical += WINDOW_OVERLAP_SHIFT_INTERVAL;
                    result.horizontal += WINDOW_OVERLAP_SHIFT_INTERVAL;
                }
            } else {
                return result;
            }
        }

        alert("bugged af")
    };

    const runApp = useCallback((app: AppModel, pos?: AppPos) => {
        if (!pos) {
            const newPos = findNextWindowStartPosition(app.initialHeight, app.initialWidth);

            if (newPos == null) {
                alert("Stop (TODO: better error)");
                return;
            }

            pos = {
                top: newPos.vertical,
                left: newPos.horizontal,
                bottom: newPos.vertical + app.initialHeight,
                right: newPos.horizontal + app.initialWidth
            }
        }

        setRunningApps(prev => {
            if (app.singleInstance && prev.some(x => x.app.identifier === app.identifier)) {
                return prev;
            }

            return [
                ...prev,
                {
                    app,
                    id: ++currentId.current,
                    pos: pos
                }
            ];
        });
    }, [findNextWindowStartPosition]);

    useEffect(() => {
        const windowTimeout = setTimeout(() => {
            if (INITIAL_BOOT_STATE !== BootState.BIOS) return;
            setRunningApps([{
                app: Startup,
                pos: {
                    top: window.innerHeight / 2 - STARTUP_APP_SIZE,
                    left: window.innerWidth / 2 - STARTUP_APP_SIZE,
                    bottom: window.innerHeight / 2 + STARTUP_APP_SIZE,
                    right: window.innerWidth / 2 + STARTUP_APP_SIZE
                },
                id: 1 // this is safe because the entire runningApps array will get cleared after "loading"
            }]);
        }, 500);

        const loadingTimeout = setTimeout(() => {
            if (INITIAL_BOOT_STATE !== BootState.BIOS) return;
            setRunningApps([]);
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

    const updateRunningApp = useCallback((app: number, producer: (draft: RunningApp) => void) => {
        setRunningApps(prev => produce(prev, draft => {
            const index = draft.findIndex(runningApp => runningApp.id === app);
            producer(draft[index]);
        }));
    }, []);

    return (
        <div id="OS">
            <div id="drag-area" ref={dragAreaRef}>
                <DragDropProvider onDragEnd={(event) => {
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
                                <SlowLoad>
                                    <div className="desktop-icon">
                                        <img src={app.icon} alt={app.name + " App (Desktop Icon)"}
                                             onClick={() => runApp(app)}/>
                                        <p>{app.name}</p>
                                    </div>
                                </SlowLoad>
                            ))}
                        </div>
                    </SlowLoad>
                    {runningApps.map((appModel) => <RunningApp
                            key={appModel.id}
                            app={appModel.app}
                            id={appModel.id}
                            pos={appModel.pos}
                            setPos={(pos) => updateRunningApp(appModel.id, (draft) => draft.pos = pos)}
                        />
                    )}
                </DragDropProvider>
            </div>
            <SlowLoad duration={DESKTOP_LOAD_START}>
                <div id="taskbar">
                    <SlowLoad>
                        <button id="start">
                            <img id="logo" src={Logo} alt=""/>
                            <b>Start</b>
                        </button>
                    </SlowLoad>
                    <div className="divider-1"></div>
                    <div className="divider-2"></div>
                    <div style={{width: 100}}/>
                    {/*Placeholders*/}
                    <div className="divider-1"></div>
                    <div className="divider-2"></div>
                    <div id="taskbar-right">
                        <div className="divider-1"></div>
                        <div className="status-field-border" id="status-menu">
                            <SlowLoad><p id="clock">{time}</p></SlowLoad>
                        </div>
                    </div>
                </div>
            </SlowLoad>
        </div>
    )
}

export default OS;
