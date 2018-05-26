import { ActionType, getType } from 'typesafe-actions';

import * as actions from './action';
export interface IHomeState {
    readonly menuOpen: boolean
}
type Actions = ActionType<typeof actions>

export default (state: IHomeState = { menuOpen: true }, action: Actions): IHomeState => {
    switch (action.type) {
        case getType(actions.doOpenMenu):
            return {
                menuOpen: true
            }
        case getType(actions.doHideMenu):
            return {
                menuOpen: false
            }
        default:
            return state
    }
}


