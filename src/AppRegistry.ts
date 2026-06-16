import Startup from "./apps/Startup.tsx";
import type AppModel from "./apps/AppModel.ts";
import Resume from "./apps/Resume.tsx";
import Doom from "./apps/Doom.tsx";

/*** All apps must be registered here ***/
const APPS: AppModel[] = [
    Startup,
    Resume,
    Doom
]

export default APPS;
