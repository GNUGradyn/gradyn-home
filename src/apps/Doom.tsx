import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import DoomIcon from "../assets/img/Doom.png"

const Component = (props: AppProps) => <iframe src="/DOOMPlayer/index.html" />

const Doom: IApp<AppProps> = {
    name: "Doom.exe",
    label: "DOOM",
    identifier: "doom",
    icon: DoomIcon,
    component: Component,
    initialWidth: 750,
    initialHeight: 800,
    disableMargin: true
}

export default Doom;
