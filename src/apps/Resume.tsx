import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import Icon from "../assets/img/windows98-icons/ico/certificate_2.ico";

const Component = (props: AppProps) => {
    return (
        <div>
            <p>pretend this is a resume</p>
        </div>
    )
}

const Resume: IApp = {
    name: "Resume",
    identifier: "resume",
    icon: Icon,
    component: Component,
    initialWidth: 350,
    initialHeight: 500
}

export default Resume;
