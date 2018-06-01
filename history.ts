import { push } from "react-router-redux";
import { elementRouterURL } from "./model";

export function pushElement(ele: string) {
    return push(elementRouterURL(ele));
}
