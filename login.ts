import { AxiosPromise } from "axios";
import { push } from "react-router-redux";

import { APIGet } from "./api";
import { pushElement } from "./history";
import { IElement } from "./model";
import * as actions from "./root/action";
import { store } from "./store";

interface ILoginParam {
    userName: string;
    password: string;
}
export let loginPromise: { resolve: (value?: any) => void; reject: (reason?: any) => void } | undefined;
export interface ILoginResult {
    IndexElement: string;
    PublicEles: IElement[];
    Elements: IElement[];
    ProjectLabel: string;
}

export function getPublicElement(): AxiosPromise<IElement[]> {
    return APIGet<IElement[]>("login", "getPublicElement");
}

export function login(param: ILoginParam) {
    return APIGet<ILoginResult>("login", "login", undefined, param).then(val => {
        store.dispatch(actions.doInitiElements(val.data.Elements));
        store.dispatch(actions.setDisplayLabel(val.data.ProjectLabel));
        // 如果有Promeise，说明是中途插入认证，需要回调resolve来重新发起ajzx请求
        if (loginPromise) {
            loginPromise.resolve();
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
export function loginUrl() {
    return "/front/login";
}
