declare global {
    interface Window {
        Dos: (
            element: HTMLElement,
            options: {
                url: string;
            }
        ) => unknown;
    }

    const Dos: Window["Dos"];
}

export {};
