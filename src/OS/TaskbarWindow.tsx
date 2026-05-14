import "./TaskbarWindow.css"

interface TaskbarWindowProps {
    name: string;
    icon: string | null;
    focused: boolean;
    focusApp: () => void;
}

const TaskbarWindow = (props: TaskbarWindowProps) => {
    return (
        <button className={["taskbar-button", "taskbar-window", props.focused && "active"].join(" ")} onClick={props.focusApp}>
            {props.icon && <img src={props.icon} alt="" height={16} width={16}/>}
            <p>{props.name}</p>
        </button>
    )
}

export default TaskbarWindow;
