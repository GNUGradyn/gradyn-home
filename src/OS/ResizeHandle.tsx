import "./ResizeHandle.css"
import {ResizeHandleDirection} from "../models/ResizeHandleDirection.ts";
import {type PointerEvent} from "react";

interface ResizeHandleProps {
    direction: ResizeHandleDirection;
    onDrag: (position: { x: number, y: number }) => void;
}
const dragHandleSize = 5;

const getStyles = (direction: ResizeHandleDirection) => {
    switch (direction) {
        case ResizeHandleDirection.TOP:
            return {
                top: -dragHandleSize,
                right: -dragHandleSize,
                left: -dragHandleSize,
                height: dragHandleSize * 2,
                cursor: "ns-resize",
            };
        case ResizeHandleDirection.RIGHT:
            return {
                top: -dragHandleSize,
                bottom: -dragHandleSize,
                right: -dragHandleSize,
                width: dragHandleSize * 2,
                cursor: "ew-resize",
            };
        case ResizeHandleDirection.BOTTOM:
            return {
                bottom: -dragHandleSize,
                left: -dragHandleSize,
                right: -dragHandleSize,
                height: dragHandleSize * 2,
                cursor: "ns-resize",
            }
        case ResizeHandleDirection.LEFT:
            return {
                top: -dragHandleSize,
                left: -dragHandleSize,
                bottom: -dragHandleSize,
                width: dragHandleSize * 2,
                cursor: "ew-resize",
            }
        case ResizeHandleDirection.TOP_LEFT:
            return {
                top: -dragHandleSize,
                left: -dragHandleSize,
                width: 20,
                height: 20,
                cursor: "nwse-resize"
            }
        case ResizeHandleDirection.TOP_RIGHT:
            return {
                top: -dragHandleSize,
                right: -dragHandleSize,
                width: 20,
                height: 20,
                cursor: "nesw-resize"
            }
        case ResizeHandleDirection.BOTTOM_LEFT:
            return {
                bottom: -dragHandleSize,
                left: -dragHandleSize,
                width: 20,
                height: 20,
                cursor: "nesw-resize"
            }
        case ResizeHandleDirection.BOTTOM_RIGHT:
            return {
                bottom: -dragHandleSize,
                right: -dragHandleSize,
                width: 20,
                height: 20,
                cursor: "nwse-resize"
            }
        default:
            throw new Error("Invalid resize handle direction");
    }
}

const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget!.setPointerCapture(e.pointerId);
};

const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
};

const ResizeHandle = (props: ResizeHandleProps) => {
    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            props.onDrag({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <div className="resize-handle" style={getStyles(props.direction)} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}/>
    )
}

export default ResizeHandle;
