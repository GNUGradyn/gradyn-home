import {createContext, type PropsWithChildren, useContext, useEffect, useState} from "react";

interface SlowLoadProps extends PropsWithChildren {
    minDuration?: number;
    maxDuration?: number;
    duration?: number;
    noShift?: boolean;
}

// This context is to notify child SlowLoads that there is a parent SlowLoad that has not loaded yet
// This is done instead of conditionally rendering the child so that real loading can occur during fake loading so that e.g. images dont load in late
const SlowLoaderContext = createContext({
    loaded: null as boolean | null // Start with null so if there is no parent, slow load starts immediately
});

/**
 * You can "wrap" slow loaded elements. E.g. you can put the start button in the taskbar and the taskbar will slow load first then the start button.
 * min and max duration is ignored if duration is specified.
 * Specifying `noShift` will cause the element to be invisible instead of being entirely removed from the flow of the page
 * @param props
 * @constructor
 */
const SlowLoad = (props: SlowLoadProps) => {
    const [loaded, setLoaded] = useState(false);
    const slowLoaderContext = useContext(SlowLoaderContext);

    useEffect(() => {
        // Specifically check === false because null is falsey
        if (slowLoaderContext.loaded === false) return;

        const timeout = setTimeout(() => {
            setLoaded(true);
        }, props.duration ?? (Math.random() * (props.maxDuration ?? 1000) + (props.minDuration ?? 500)));

        return () => clearTimeout(timeout);
    }, [slowLoaderContext.loaded])

    // OPTIMIZATION: use display instead of conditional rendering so that icons and such actually load during fake loading
    return (
        <SlowLoaderContext.Provider value={{loaded}}>
            <div style={props.noShift ?
                {visibility: loaded ? 'visible' : 'hidden'}
                :
                {display: loaded ? 'block' : 'none'}
            }>{props.children}</div>
        </SlowLoaderContext.Provider>
    );
}

export default SlowLoad;
