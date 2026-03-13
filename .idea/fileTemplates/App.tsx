import type IApp from "./AppModel.ts";
import {type AppProps} from "./AppModel.ts";
import Icon from "../assets/img/${Icon}";

const Component = (props: AppProps) => {
    return (
        <div>

        </div>
    )
}

const ${NAME}: IApp = {
    name: "${NAME}",
    id: "${name}",
    icon: Icon,
    component: Component,
    isHidden: false,
    isSpecial: false,
    singleInstance: false
}

export default ${NAME};