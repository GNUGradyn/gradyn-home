import Startup from "./apps/Startup.tsx";
import type AppModel from "./apps/AppModel.ts"
import Resume from "./apps/Resume.tsx";

/*** All apps must be registered here ***/
const APPS: AppModel[] = [
    Startup,
    Resume
]

export default APPS;
