import { ActionType, getType } from 'typesafe-actions';
import { IDept, IElement } from '../model';
import * as actions from './action';
import { ICategory, setMenuOpenOrClose } from './list';
import buildMenusFromElements from './menus';
export interface IRootStore {
	readonly version: string;
	readonly projectLabel?: string;
	readonly logined?: boolean;
	readonly userName?: string;
	readonly dept?: IDept;
	readonly brand?: string;
	readonly serviceVersion?: number;
	readonly publicEles?: ReadonlyArray<IElement>;
	readonly elements?: ReadonlyArray<IElement>;
	readonly menus?: ICategory;
	readonly toRootDept?: IDept[];
	readonly nextLevelDept?: IDept[];
	readonly switchDeptSignStr?: string;
	readonly language: string;
}

const root = (state: IRootStore = { version: '0', language: navigator.language }, action: Actions): IRootStore => {
	switch (action.type) {
		case getType(actions.doSetVersion):
			return {
				...state,
				version: action.payload
			};
		case getType(actions.doLoginedIniti):
			return {
				...state,
				elements: action.payload.elements,
				menus: buildMenusFromElements(action.payload.elements),
				userName: action.payload.userName,
				dept: action.payload.dept,
				logined: true,
				serviceVersion: action.payload.version,
				brand: action.payload.brand,
				toRootDept: action.payload.toRootDept,
				nextLevelDept: action.payload.nextLevelDept,
				switchDeptSignStr: action.payload.switchDeptSignStr
			};
		case getType(actions.setProjectLabel):
			return {
				...state,
				projectLabel: action.payload
			};
		case getType(actions.doSetMenu):
			return {
				...state,
				menus: setMenuOpenOrClose(
					state.menus as ICategory,
					action.payload.path.replace(/^\/|\/$/g, '').split('/'),
					action.payload.openOrClose
				)
			};
		case getType(actions.doLogout):
			return {
				version: state.version,
				publicEles: state.publicEles,
				projectLabel: state.projectLabel,
				language: state.language
			};
		case getType(actions.doSwitchDept):
			return {
				...state,
				dept: action.payload.dept,
				toRootDept: action.payload.toRootDept,
				nextLevelDept: action.payload.nextLevelDept
			};
		case getType(actions.doSetLanguage):
			return {
				...state,
				language: action.payload
			};
		default:
			return state;
	}
};
type Actions = ActionType<typeof actions>;
export default root;
