import * as _ from "lodash";
import { ActionType, getType } from "typesafe-actions";

import { IElement } from "../model/element";
import { IModuleList } from "../model/module";
import * as actions from "./action";

const root = (
    state: IRootState = {
        modules: {},
        apiRootPath: "/"
    },
    action: Actions
): IRootState => {
    switch (action.type) {
        case getType(actions.doIniti):
            const loginEle = {
                Name: "login",
                Controller: "login"
            } as IElement;
            return {
                modules: action.payload.modules,
                apiRootPath: action.payload.apiRootPath,
                elements: [loginEle]
            };
        case getType(actions.doAssignElements):
            return _.assign({}, state, {
                elements: _.union(state.elements, action.payload)
            });
        case getType(actions.doSetIndex):
            const ele = _.find(state.elements, { Name: action.payload });
            if (ele) {
                return _.assign({}, state, {
                    index: ele
                });
            } else {
                return state;
            }
        default:
            return state;
    }
};
export interface IRootState {
    readonly modules: IModuleList;
    readonly apiRootPath: string;
    readonly elements?: ReadonlyArray<IElement>;
    readonly indexElement?: IElement;
}
type Actions = ActionType<typeof actions>;
export default root;
