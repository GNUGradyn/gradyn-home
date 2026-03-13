import {type PropsWithChildren, useEffect, useState} from "react";

interface SlowLoadProps extends PropsWithChildren {
    minDuration?: number;
    maxDuration?: number;
    duration?: number;
}

/**
 * You can "wrap" slow loaded elements. E.g. you can put the start button in the taskbar and the taskbar will slow load first then the start button. min and max duration is ignored if duration is specified. Defaults to 500-1000ms
 * @param props
 * @constructor
 */
const SlowLoad = (props: SlowLoadProps) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoaded(true);
        }, props.duration ?? (Math.random() * (props.maxDuration ?? 1000) + (props.minDuration ?? 500)));

        return () => clearTimeout(timeout);
    }, [])

    return loaded && props.children;
}

export default SlowLoad;
