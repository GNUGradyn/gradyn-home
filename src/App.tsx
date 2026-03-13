import './App.css'
import {useEffect, useRef, useState} from "react";
import BIOS from "./BIOS/BIOS.tsx";
import OS from "./OS/OS.tsx";

enum BootState {
    BIOS,
    OsLoad,
    Booted
}

function App() {
    const [bootState, setbootState] = useState(BootState.BIOS);

    // #region BIOS
    const [loadBar, setLoadBar] = useState(0.01);
    const loops = useRef(1);
    const bootTimeout = useRef<number>(null);

    useEffect(() => {
        bootTimeout.current = setTimeout(() => {
            if (loadBar >= 1) {
                setbootState(BootState.OsLoad);
            } else {
                setLoadBar((previousValue: number) => previousValue + 0.05)
                loops.current = loops.current + 1;
            }
        }, 1000 / loops.current);
    }, [loadBar, setbootState]);
    //#endregion bios

    return (
        <>
            {bootState != BootState.BIOS ?
                <OS
                    isBooted={bootState === BootState.Booted}
                    skipBoot={() => setbootState(BootState.Booted)}
                />
                :
                <BIOS loadBar={loadBar} onclick={() => {
                    // setbootState(BootState.OsLoad);
                    // clearTimeout(bootTimeout.current ?? undefined);
                }}/>}
        </>
    )
}

export default App
