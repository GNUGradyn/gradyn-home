import "./Error.css"
import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import Icon from "../assets/img/windows98-icons/ico/msg_error.ico";
import "./Startup.css";

interface ErrorProps extends AppProps {
    message: string;
}

const Component = (props: ErrorProps) => {
    return (
        <div className="error">
            <p>{props.message}</p>
            <button onClick={() => props.close()}>OK</button>
        </div>
    );
}

const Error: IApp<ErrorProps> = {
    name: "Error",
    identifier: "error",
    icon: Icon,
    component: Component,
    isHidden: true,
    singleInstance: true,
    initialWidth: 0, // not used for this window
    initialHeight: 0 // not used for this window
}

export default Error;
