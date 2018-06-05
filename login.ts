import { AxiosPromise } from 'axios';
import { push } from 'react-router-redux';

import { APIGet } from './api';
import { pushElement } from './history';
import { IDept, IElement } from './model';
import * as actions from './root/action';
import { loadStoreAndReplaceReducer, resetStore, store } from './store';

interface ILoginParam {
    userName: string;
    password: string;
}
let loginPromise: { resolve: (value?: any) => void; reject: (reason?: any) => void } | undefined;
let loginNext: string | undefined;

export interface ILoginResult {
    IndexElement: string;
    PublicEles: IElement[];
    Elements: IElement[];
    ProjectLabel: string;
    Brand: string;
    Version: number;
    Dept: IDept;
}

export function getPublicElement(): AxiosPromise<IElement[]> {
    return APIGet<IElement[]>('login', 'getPublicElement');
}
export function isLogined(): AxiosPromise<string> {
    return APIGet<string>('login', 'isLogined');
}

export function login(param: ILoginParam) {
    return APIGet<ILoginResult>('login', 'login', undefined, param).then(val => {
        // 重新调入redux 的 store
        store.dispatch(resetStore(loadStoreAndReplaceReducer(param.userName, val.data.Elements)));
        store.dispatch(
            actions.doLoginedIniti({
                elements: val.data.Elements,
                userName: param.userName,
                dept: val.data.Dept,
                brand: val.data.Brand,
                version: val.data.Version
            })
        );
        store.dispatch(actions.setDisplayLabel(val.data.ProjectLabel));
        // 如果有Promeise，说明是中途插入认证，需要回调resolve来重新发起ajzx请求
        if (loginPromise) {
            loginPromise.resolve();
        } else if (loginNext) {
            // 如果有指定的跳转url
            store.dispatch(push(loginNext));
        } else {
            // 否则是转向默认的index页面
            store.dispatch(pushElement(val.data.IndexElement));
        }
    });
}

export function showLogin() {
    const oldurl = window.location.href;
    return new Promise((resolve, reject) => {
        // loginPromise用于向login登录成功后的处理传值
        loginPromise = { resolve, reject };
        store.dispatch(push(loginUrl()));
    }).then(() => {
        loginPromise = undefined;
        store.dispatch(push(oldurl));
    });
}
export function showLoginAfterToNext(next?: string) {
    loginNext = next;
    store.dispatch(push(loginUrl()));
}
export function loginUrl() {
    return '/front/login';
}
