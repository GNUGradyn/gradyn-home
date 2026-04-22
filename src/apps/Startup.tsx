import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import Icon from "../assets/img/windows98-icons/ico/chm.ico";
import Loader from "../assets/img/loading.gif";
import "./Startup.css";
import {useEffect, useState} from "react";

const Component = (props: AppProps) => {
    const [loadingDots, setLoadingDots] = useState(0);

    useEffect(() => {
        const loadingInterval = setInterval(() => {
            setLoadingDots(prev => {
                if (prev >= 3) {
                    return 0;
                }
                return prev + 1;
            });
        }, 500);

        return () => clearInterval(loadingInterval);
    }, [loadingDots]);

    return (
        <div id="startup-app">
            <p>Gradyn OS is starting{[...Array(loadingDots).keys()].map(() => '.').join('')}</p>
            <img src={Loader} alt=""/>
        </div>
    );
}

const Startup: IApp = {
    name: "Starting Gradyn OS",
    identifier: "startup",
    icon: Icon,
    component: Component,
    isHidden: true,
    isSpecial: true,
    singleInstance: true,
    initialWidth: 0, // not used for this window
    initialHeight: 0 // not used for this window
}

export default Startup;
