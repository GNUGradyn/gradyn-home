import {type ComponentType} from "react";
import type {Controls} from "../types/Controls.ts";

export interface AppProps {
    close: () => void;
}

/***
 Interface representing an "installed" application.

 `name` is the name to be app icon

 `label` is the name to be displayed on the navbar and the taskbar - defaults to `name`

 'icon' is the image to be used for the app icon

 `label_icon` is the icon to be displayed on the navbar and the taskbar - defaults to `icon`

 `identifier` is a unique string with no whitespace to identify the application

 `isHidden` is used to hide applications from the start menu, prevent it from being pinned to the taskbar, etc

 `isSpecial` prevents the application from being displayed in the taskbar when open and forces it to appear focused. This is useful for things like
 the bootup modal or an error modal
 */
type AppModel<T extends AppProps = AppProps> = {
    name: string;
    label?: string;
    labelIcon?: string;
    icon: string | null;
    identifier: string;
    component: ComponentType<T>;
    isHidden?: boolean;
    isSpecial?: boolean;
    singleInstance?: boolean;
    initialHeight: number;
    initialWidth: number;
    controls?: Controls;
    disableMargin?: boolean;
}

export type {AppModel as default};
