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

const DESKTOP_LOAD_START = 6000;

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

const STARTUP_APP_SIZE = 100;

const OS = (props: OsProps) => {
    const currentId = useRef(0);
    const [time, setTime] = useState("");
    const [runningApps, setRunningApps] = useState<RunningApp[]>([]);

    const runApp = useCallback((app: AppModel, pos?: AppPos) => {
        setRunningApps(prev => {
            if (app.singleInstance && prev.some(x => x.app.identifier === app.identifier)) {
                return prev;
            }

            return [
                ...prev,
                {
                    app,
                    id: ++currentId.current,
                    pos: pos ?? { // TODO: default to default window position or a bit down and right if there is already a window there etc
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    }
                }
            ];
        });
    }, []);

    useEffect(() => {
        const windowTimeout = setTimeout(() => {
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
            <div id="drag-area">
                <DragDropProvider onDragEnd={(event) => {
                    const resultRect = event.operation.source?.element?.getBoundingClientRect();
                    updateRunningApp(event.operation.source?.id as number, (draft) => {
                        draft.pos = {
                            top: resultRect?.top ?? 0,
                            left: resultRect?.left ?? 0,
                            bottom: resultRect?.bottom ?? 0,
                            right: resultRect?.right ?? 0,
                        }
                    });
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
