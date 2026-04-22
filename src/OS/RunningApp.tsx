import type AppModel from "../apps/AppModel.ts";
import {useDraggable} from "@dnd-kit/react";
import "./RunningApp.css";
import "98.css";
import type {AppPos} from "./OS.tsx";
import ResizeHandle from "./ResizeHandle.tsx";
import {ResizeHandleDirection} from "../models/ResizeHandleDirection.ts";

interface RunningAppProps {
    app: AppModel,
    id: number,
    pos: AppPos,
    setPos: (pos: AppPos) => void
}

const MIN_VERTICAL_SIZE = 100;
const MIN_HORIZONTAL_SIZE = 100;

const RunningApp = (props: RunningAppProps) => {
    const {ref: draggableRef, handleRef: draggableHandleRef} = useDraggable({
        id: props.id,
    });

    return (
        <div className="window" ref={draggableRef} style={{
            top: props.pos.top,
            left: props.pos.left,
            // using width and height instead of right and bottom because right and bottom are relative to the right and the bottom respectively.
            // It is possible to account for this by doing the width of the window minus the left position for `right` and height - bottom for `bottom`
            // But that does not play nice with resizing the real browser window. You could use a resize observer but that would not resize smoothly.
            // This complicates resizing since during resize you have to attach to the top/left for those dimensions and the width/height for the others
            // But it is the path of least resistance because after the resize it can just be remeasured per usual like after a move, and resizing the
            // browser window will just work smoothly without any effort
            width: props.pos.right - props.pos.left,
            height: props.pos.bottom - props.pos.top
        }}>
            <ResizeHandle direction={ResizeHandleDirection.LEFT} onDrag={(position) => {
                props.setPos({...props.pos, left: Math.min(position.x, props.pos.right - MIN_HORIZONTAL_SIZE)});
            }}/>
            <ResizeHandle direction={ResizeHandleDirection.TOP} onDrag={(position) => {
                props.setPos({...props.pos, top: Math.min(position.y, props.pos.bottom - MIN_VERTICAL_SIZE)});
            }}/>
            <ResizeHandle direction={ResizeHandleDirection.BOTTOM} onDrag={(position) => {
                props.setPos({...props.pos, bottom: Math.max(position.y, props.pos.top + MIN_VERTICAL_SIZE)});
            }}/>
            <ResizeHandle direction={ResizeHandleDirection.RIGHT} onDrag={(position) => {
                props.setPos({...props.pos, right: Math.max(position.x, props.pos.left + MIN_HORIZONTAL_SIZE)});
            }}/>
            <ResizeHandle direction={ResizeHandleDirection.TOP_LEFT} onDrag={(position) => {
                props.setPos({...props.pos,
                    left: Math.min(position.x, props.pos.right - MIN_HORIZONTAL_SIZE),
                    top: Math.min(position.y, props.pos.bottom - MIN_VERTICAL_SIZE),
                });
            }}/>
            <ResizeHandle direction={ResizeHandleDirection.TOP_RIGHT} onDrag={(position) => {
                props.setPos({...props.pos,
                    right: Math.max(position.x, props.pos.left + MIN_HORIZONTAL_SIZE),
                    top: Math.min(position.y, props.pos.bottom - MIN_VERTICAL_SIZE),
                });
            }}/>
            <ResizeHandle direction={ResizeHandleDirection.BOTTOM_LEFT} onDrag={(position) => {
                props.setPos({...props.pos,
                    left: Math.min(position.x, props.pos.right - MIN_HORIZONTAL_SIZE),
                    bottom: Math.max(position.y, props.pos.top + MIN_VERTICAL_SIZE)
                });
            }}/>
            <ResizeHandle direction={ResizeHandleDirection.BOTTOM_RIGHT} onDrag={(position) => {
                props.setPos({...props.pos,
                    right: Math.max(position.x, props.pos.left + MIN_HORIZONTAL_SIZE),
                    bottom: Math.max(position.y, props.pos.top + MIN_VERTICAL_SIZE)
                });
            }}/>
            <div className="title-bar" ref={draggableHandleRef}>
                <div className="title-bar-text">
                    {props.app.icon && <img src={props.app.icon} alt=""/>}
                    {props.app.name}
                </div>
            </div>
            <div className="window-body">
                <props.app.component/>
            </div>
        </div>
    );
}

export default RunningApp;
