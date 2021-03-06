import { History } from 'history';
import createHistory from 'history/createBrowserHistory';
import * as _ from 'lodash';
import { addLocaleData } from 'react-intl';
import * as appLocaleDataEN from 'react-intl/locale-data/en';
import * as appLocaleDataZH from 'react-intl/locale-data/zh';
import { connect } from 'react-redux';
import { routerMiddleware, routerReducer } from 'react-router-redux';
import {
	AnyAction,
	applyMiddleware,
	combineReducers,
	compose,
	createStore,
	Dispatch,
	Reducer,
	Store,
	StoreEnhancer
} from 'redux';
import thunk from 'redux-thunk';
import { getPublicElement, isLogined, loginUrl, showLoginAfterToNext } from './login';
import { IMessageMap, registerLanguage } from './messages';
import { IElement } from './model';
import { doSetVersion } from './root/action';
import root, { IRootStore } from './root/reducer';
import { withElement } from './withElement';
import withStatic from './withStatic';
// tslint:disable-next-line:no-var-requires
const config = require('../../../package.json');
export let modules: any;
export let apiRootPath: string;
export let store: Store;
export let history: History;
export const PROJECT_LABEL = 'root_project_label';
interface IElementProps {
	element: IElement;
	[key: string]: any;
}
const loadState = (userName: string) => {
	try {
		// 也可以容错一下不支持localStorage的情况下，用其他本地存储
		const serializedState = localStorage.getItem('state.' + userName);
		if (serializedState === null) {
			return undefined;
		} else {
			const state = JSON.parse(serializedState);
			if (state.version < config.version) {
				return undefined;
			} else {
				return state;
			}
		}
	} catch (err) {
		// ... 错误处理
		alert(err);
	}
	return undefined;
};
const saveUserStore = () => {
	saveState(store.getState());
};
const saveState = (state: any) => {
	try {
		// 如果没有登录，就不保存
		if (!(state.root as IRootStore).logined) {
			return;
		}
		const userName = (state.root as IRootStore).userName;
		if (!userName) {
			return;
		}
		// login有敏感信息，不保存
		const serializedState = JSON.stringify(_.omit(state, 'login'));

		localStorage.setItem('state.' + userName, serializedState);
	} catch (err) {
		// ...错误处理
		alert(err);
	}
};
window.onbeforeunload = e => {
	store.dispatch(doSetVersion(config.version)); // 代码全局变量，随工程配置一起处理即可。每次涉及需要更新state的时候，必须更新此版本号。
	const state = store.getState();
	saveState(state);
	return null;
};
function createReducer(asyncReducers?: any) {
	return combineReducers({
		root,
		home: modules.home.reducer,
		router: routerReducer,
		...asyncReducers
	});
}
let allReducers: any;
let publicEles: IElement[];
let projectLabel: string;
function createNamedWrapperReducer(reducerFunction: (state: any, action: any) => void, reducerName: string) {
	return (state: any, action: any) => {
		const { name } = action;
		const isInitializationCall = state === undefined;
		if (name !== reducerName && !isInitializationCall) {
			return state;
		}
		return reducerFunction(state, action);
	};
}
// export function registerReducer(name: string, reducer: any) {
//     reducers[name] = createNamedWrapperReducer(reducer, name);
//     store.replaceReducer(createReducer(reducers));
// }
const TYPE_RESET_STORE = '[root]TYPE_RESET_STORE';
const resetStore = (state: any) => {
	return {
		type: TYPE_RESET_STORE,
		payload: state
	};
};

function rootReducer(state: any = {}, action: any) {
	if (action.type === TYPE_RESET_STORE) {
		return { ...state, ...action.payload };
	} else {
		return allReducers(state, action);
	}
}
// 登录后，真正调取上次保存的状态
const loadStoreAndReplaceReducer = (userName: string, eles: IElement[]) => {
	let initStore = loadState(userName);
	if (initStore) {
		initStore = _.pick(initStore, 'root', 'home', 'router', ..._.map(eles, val => val.Name));
	}
	refreshReducer(_.union(eles, publicEles));
	return initStore;
};
function refreshReducer(eles: IElement[]) {
	const reducers = {};

	eles.forEach(val => {
		if (modules[val.Controller] && modules[val.Controller].reducer) {
			reducers[val.Name] = createNamedWrapperReducer(modules[val.Controller].reducer, val.Name);
		}
	});
	allReducers = createReducer(reducers);
}

export async function register(mds: any, rootPath: string) {
	addLocaleData([...appLocaleDataEN, ...appLocaleDataZH]);
	// 收集语言资料
	_.each(mds, val => {
		if (val.i18nMessages) {
			registerLanguage(val.i18nMessages);
		}
	});
	modules = mds;
	apiRootPath = rootPath;
	history = createHistory();

	const middleware = routerMiddleware(history);
	// Add the reducer to your store on the `router` key
	// Also apply our middleware for navigating
	// tslint:disable-next-line:no-string-literal
	const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;

	await getPublicElement().then(data => {
		publicEles = data.data.Elements;
		projectLabel = data.data.DefaultProjectLabel;

		registerLanguage(
			_.mapValues(data.data.ProjectLabelLocales, o => ({
				[PROJECT_LABEL]: o
			}))
		);
	});

	await isLogined().then(data => {
		doInitStore(data.data, composeEnhancers(applyMiddleware(middleware, thunk)));
	});
}

function doInitStore(userName: string, enhancers: StoreEnhancer<Store<any, AnyAction>, {}> | undefined) {
	let initStore = null;
	if (userName) {
		initStore = loadState(userName);
		let eles = publicEles;
		let newRoot;
		if (initStore) {
			// 从elements中重建
			eles = [...eles, ...initStore.root.elements];
			newRoot = { ...initStore.root, publicEles, projectLabel };
		} else {
			newRoot = { publicEles, projectLabel };
		}
		refreshReducer(eles);
		store = createStore(rootReducer, { ...initStore, root: newRoot }, enhancers);
	} else {
		refreshReducer(publicEles);
		store = createStore(rootReducer, { root: { version: '0', publicEles, projectLabel } } as any, enhancers);
	}
	if (!store.getState().root.logined) {
		let oldUrl;

		if (oldUrl !== loginUrl() || oldUrl !== '/') {
			oldUrl = window.location.pathname;
		}
		showLoginAfterToNext(oldUrl);
	}
}
function nameDispatch(dispatch: Dispatch, name: string) {
	const withNameDispatch = (action: any) => {
		// 如果是函数，则需要传入withNameDispatch
		if (typeof action === 'function') {
			action(withNameDispatch);
			return action;
		}

		const ac = nameAction(action, name);
		dispatch<any>(ac);
		return ac;
	};
	return withNameDispatch;
}
function nameAction(action: any, name: string) {
	return { ...action, name };
}
const eleConnect = (
	mapStateToProps: null | ((state: any, rootState?: any, ownProps?: any) => any),
	mapDispatchToProps?: object | ((dispatch: Dispatch, ownProps?: any) => any)
) => {
	const mapState = mapStateToProps
		? (state: any, ownProps: IElementProps) => {
				return mapStateToProps(state[ownProps.element.Name], state, ownProps);
		  }
		: null;
	let mapDispatch;
	if (mapDispatchToProps) {
		let callMapDispatch: (dispatch: Dispatch, ownProps?: any) => any;
		// 如果是对象，则创建一个包装的函数
		if (typeof mapDispatchToProps === 'object') {
			callMapDispatch = (dispatch, ownProps) =>
				_.mapValues(mapDispatchToProps, (val: any) => {
					// tslint:disable-next-line:only-arrow-functions
					return (...rest: any[]) => {
						dispatch(val(...rest));
					};
				});
		} else {
			callMapDispatch = mapDispatchToProps;
		}
		mapDispatch = (dispatch: Dispatch, ownProps: IElementProps) => {
			return callMapDispatch(nameDispatch(dispatch, ownProps.element.Name), ownProps);
		};
	}
	return compose(
		withElement,
		connect(
			mapState,
			mapDispatch
		)
	);
};

const eleComponent = (
	mapStateToProps: null | ((state: any, rootState?: any, ownProps?: any) => any),
	mapDispatchToProps?: object | ((dispatch: Dispatch, ownProps?: any) => any),
	reducer?: Reducer,
	messages?: IMessageMap
) => {
	return compose(
		withStatic(reducer, messages),
		eleConnect(mapStateToProps, mapDispatchToProps)
	);
};
export { eleComponent, eleConnect, loadStoreAndReplaceReducer, resetStore, saveUserStore };
