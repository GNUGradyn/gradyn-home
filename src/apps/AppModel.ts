import type {ComponentType, ReactNode} from "react";

/***
 Interface representing an "installed" application.

 `name` is the name to be displayed on the taskbar/etc

 `identifier` is a unique string with no whitespace to identify the application

 `isHidden` is used to hide applications from the start menu, prevent it from being pinned to the taskbar, etc

 `isSpecial` prevents the application from being displayed in the taskbar when open. This is useful for things like
 the bootup modal or an error modal
 */
export default interface AppModel {
    name: string;
    icon: string;
    identifier: string;
    component: ComponentType<AppProps>;
    isHidden?: boolean;
    isSpecial?: boolean;
    singleInstance?: boolean;
}

export interface AppProps {

}
