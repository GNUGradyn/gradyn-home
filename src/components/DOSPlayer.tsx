import React, { useEffect, useRef, useState } from "react";

interface DOSPlayerProps {
    bundleUrl: string;
}

const DOSPlayer = (props: DOSPlayerProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        Dos(ref.current, {
            url: props.bundleUrl,
        });
    }, []);

    return <div ref={ref} style={{ width: "100%", height: "600px" }} />;
}

export default DOSPlayer;
