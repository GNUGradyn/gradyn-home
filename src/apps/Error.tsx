import "./Error.css"
import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import Icon from "../assets/img/windows98-icons/ico/msg_error.ico";
import "./Startup.css";
import {Controls} from "../types/Controls.ts";

interface ErrorProps extends AppProps {
    message: string;
    bodyLayout: {
        width: number;
        height: number;
    }
}

const Component = (props: ErrorProps) => {
    return (
        <div className="error">
            <div className="error-message">
                <img src={Icon} alt="" />
                <p>{props.message}</p>
            </div>
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
    singleInstance: false,
    initialWidth: 0, // not used for this window
    initialHeight: 0, // not used for this window
    controls: Controls.CloseOnly
}

export default Error;
