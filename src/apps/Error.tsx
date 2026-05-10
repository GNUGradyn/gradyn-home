import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import Icon from "../assets/img/windows98-icons/ico/msg_error.ico";
import "./Startup.css";

const Component = (props: AppProps) => {
    return (
        <div className="error">

        </div>
    );
}

const Error: IApp<> = {
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
