import { History } from "history";
import createHistory from "history/createBrowserHistory";
import * as _ from "lodash";
import { connect } from "react-redux";
import { routerMiddleware, routerReducer } from "react-router-redux";
import {
    AnyAction,
    applyMiddleware,
    combineReducers,
    compose,
    createStore,
    Dispatch,
    Store,
    StoreEnhancer
} from "redux";

import { getPublicElement, isLogined, loginUrl, showLoginAfterToNext } from "./login";
import home from "./main/home/reducer";
import { IElement, IModuleList } from "./model";
import { doSetVersion } from "./root/action";
import root, { IRootStore } from "./root/reducer";

// tslint:disable-next-line:no-var-requires
const config = require("../../../package.json");
export let modules: IModuleList;
export let apiRootPath: string;
export let store: Store;
export let history: History;
const loadState = (userName: string) => {
    try {
        // 也可以容错一下不支持localStorage的情况下，用其他本地存储
        const serializedState = localStorage.getItem("state." + userName);
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
        const serializedState = JSON.stringify(_.omit(state, "login"));
        localStorage.setItem("state." + userName, serializedState);
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
        home,
        router: routerReducer,
        ...asyncReducers
    });
}
let reducers: any = {};
let enhancers: StoreEnhancer<Store<any, AnyAction>, {}> | undefined;
let allReducers: any;
let publicEles: IElement[];
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
const TYPE_RESET_STORE = "[root]TYPE_RESET_STORE";
export function resetStore(state: any) {
    return {
        type: TYPE_RESET_STORE,
        payload: state
    };
}
function commonReducer(state: any = {}, action: any) {
    return state;
}
function rootReducer(state: any = {}, action: any) {
    if (action.type === TYPE_RESET_STORE) {
        // tslint:disable:no-console
        console.log(state, action.payload);
        return { ...state, ...action.payload };
    } else {
        return allReducers(state, action);
    }
}
// 登录后，真正调取上次保存的状态
export function loadStoreAndReplaceReducer(userName: string, eles: IElement[]) {
    reducers = {};
    _.union(eles, publicEles).forEach(val => {
        if (modules[val.Controller] && modules[val.Controller].reducer) {
            reducers[val.Name] = createNamedWrapperReducer(modules[val.Controller].reducer, val.Name);
        }
    });
    let initStore = loadState(userName);
    // 如果store中的状态没有对应的reducer，则创建一个，防止redux自动剪枝
    if (initStore) {
        initStore = _.pick(initStore, "root", "home", "router", ..._.map(eles, val => val.Name));
    }
    allReducers = createReducer(reducers);
    return initStore;
    // store = createStore(createReducer(reducers), initStore, enhancers);
}
export async function register(mds: IModuleList, rootPath: string) {
    modules = mds;
    apiRootPath = rootPath;
    history = createHistory();

    // Build the middleware for intercepting and dispatching navigation actions
    const middleware = routerMiddleware(history);
    reducers.login = modules.login.reducer;
    // Add the reducer to your store on the `router` key
    // Also apply our middleware for navigating
    // tslint:disable-next-line:no-string-literal
    const composeEnhancers = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;
    enhancers = composeEnhancers(applyMiddleware(middleware));
    await getPublicElement().then(data => {
        publicEles = data.data;
    });
    await isLogined().then(data => {
        let initStore = null;
        if (data.data) {
            initStore = loadState(data.data);
            // 如果store中的状态没有对应的reducer，则创建一个，防止redux自动剪枝
            if (initStore) {
                _.without(Object.keys(initStore), "root", "home", "router").forEach(
                    val => (reducers[val] = reducers[val] || commonReducer)
                );
            }
            allReducers = createReducer(reducers);
            store = createStore(rootReducer, initStore, enhancers);
        } else {
            allReducers = createReducer(reducers);
            store = createStore(rootReducer, enhancers);
        }
        if (!store.getState().root.logined) {
            const oldUrl = window.location.pathname;
            if (oldUrl !== loginUrl()) {
                showLoginAfterToNext(oldUrl);
            }
        }
    });
}

interface IElementProps {
    element: string;
    [key: string]: any;
}
function nameAction(action: any, name: string) {
    return { ...action, name };
}
export function eleConnect(
    mapStateToProps: (state: any, dynamicState: any, ownProps?: any) => any,
    mapDispatchToProps?: (dispatch: Dispatch, ownProps?: any) => any
) {
    const mapState = (state: any, ownProps: IElementProps) => {
        return mapStateToProps(state, state[ownProps.element], ownProps);
    };
    let mapDispatch;
    if (mapDispatchToProps) {
        mapDispatch = (dispatch: Dispatch, ownProps: IElementProps) => {
            const disph = (action: AnyAction) => {
                const ac = nameAction(action, ownProps.element);
                dispatch(ac);
                return ac;
            };
            return mapDispatchToProps(disph, ownProps);
        };
    }
    return connect(mapState, mapDispatch);
}
