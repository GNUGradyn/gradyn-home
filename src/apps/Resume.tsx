import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import Icon from "../assets/img/windows98-icons/ico/certificate_2.ico";

const Component = (props: AppProps) => {
    return (
        <div>

        </div>
    )
}

const Resume: IApp = {
    name: "Resume.tsx",
    identifier: "resume",
    icon: Icon,
    component: Component
}

export default Resume;
