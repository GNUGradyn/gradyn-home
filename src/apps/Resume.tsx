import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import Icon from "../assets/img/windows98-icons/ico/certificate_2.ico";
import LabelIcon from "../assets/img/agrorat.png"
import "./Resume.css"
import {useMemo} from "react";

const Component = (props: AppProps) => {
    // This is memoized to prevent the iframe from flashing for a re-render
    const resumeFrame = useMemo(() => <iframe src="/resume.pdf" width="100%" height="100%" onLoad={() => console.log("resume load")}/>, []);

    return (
        <div style={{height: "100%"}}>
            <div className="resume-url">
                <input type="text" value="https://gradyn.com/resume.pdf"/>
                <button onClick={() => window.open("https://gradyn.com/resume.pdf", "_blank")}>Open In Host</button>
            </div>
            {resumeFrame}
        </div>
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
