import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import DoomIcon from "../assets/img/Doom.png"
import DOSPlayer from "../components/DOSPlayer.tsx";

const Component = (props: AppProps) => <DOSPlayer bundleUrl="/DOOM.jsdos" />

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
