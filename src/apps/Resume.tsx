import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import Icon from "../assets/img/windows98-icons/ico/certificate_2.ico";
import LabelIcon from "../assets/img/agrorat.png"

const Component = (props: AppProps) => {
    return (
        <iframe src="/resume.pdf" width="100%" height="100%"/>
    )
}

const Resume: IApp<AppProps> = {
    name: "Resume.pdf",
    label: "Resume.pdf - Adobske AgroRat",
    labelIcon: LabelIcon,
    identifier: "resume",
    icon: Icon,
    component: Component,
    initialWidth: 750,
    initialHeight: 800,
    disableMargin: true
}

export default Resume;
