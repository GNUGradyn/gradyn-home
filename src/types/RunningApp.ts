// Running apps is a heterogeneous collection: each app has its own props type.
// `runApp` checks that appArgs matches the app before insertion, then we erase
// that specific props type here because typescript cannot represent "some P extends AppProps".
import type AppModel from "../apps/AppModel.ts";

export enum AppState {
    Open,
    Minimized,
    Maximized
}

export interface AppPos {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export default interface RunningAppModel {
    app: AppModel<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    id: number;
    pos: AppPos;
    appArgs?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    appState: AppState;
}
