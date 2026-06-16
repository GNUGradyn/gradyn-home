import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import Icon from "../assets/img/windows98-icons/ico/certificate_2.ico";
import LabelIcon from "../assets/img/agrorat.png"
import PDFView from "../components/PDFView.tsx";

const Component = (props: AppProps) => {
    return (
        <PDFView url="https://gradyn.com/resume.pdf" />
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
