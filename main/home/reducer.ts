import { ActionType, getType } from "typesafe-actions";

import * as actions from "./action";

export interface IHomeStore {
    readonly menuOpen: boolean;
    readonly elementState: {};
}

type Actions = ActionType<typeof actions>;

export default (state: IHomeStore = { menuOpen: true, elementState: {} }, action: Actions): IHomeStore => {
    switch (action.type) {
        case getType(actions.doOpenMenu):
            return {
                ...state,
                menuOpen: true
            };
        case getType(actions.doHideMenu):
            return {
                ...state,
                menuOpen: false
            };
        default:
            return state;
    }
};
