import { AxiosPromise } from 'axios';
import { push } from 'react-router-redux';

import { APIGet, APIPost } from './api';
import { pushElement } from './history';
import { IDept, IElement } from './model';
import * as actions from './root/action';
import { loadStoreAndReplaceReducer, resetStore, saveUserStore, store } from './store';

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
	Brand: string;
	Version: number;
	Dept: IDept;
	ToRootDept: IDept[];
	NextLevelDept: IDept[];
	SwitchDeptSignStr: string;
}
interface ISwitchDeptResult {
	Dept: IDept;
	ToRootDept: IDept[];
	NextLevelDept: IDept[];
}
interface IGetPublicElement {
	Elements: IElement[];
	DefaultProjectLabel: string;
	ProjectLabelLocales: { [key: string]: string };
}
export function getPublicElement(): AxiosPromise<IGetPublicElement> {
	return APIGet<IGetPublicElement>('login', 'getPublicElement');
}
export function isLogined(): AxiosPromise<string> {
	return APIGet<string>('login', 'isLogined');
}

export function login(param: ILoginParam) {
	return APIPost<ILoginResult>('login', 'login', undefined, param).then(val => {
		// 重新调入redux 的 store
		store.dispatch(resetStore(loadStoreAndReplaceReducer(param.userName, val.data.Elements)));
		store.dispatch(
			actions.doLoginedIniti({
				elements: val.data.Elements,
				userName: param.userName,
				dept: val.data.Dept,
				brand: val.data.Brand,
				version: val.data.Version,
				toRootDept: val.data.ToRootDept,
				nextLevelDept: val.data.NextLevelDept,
				switchDeptSignStr: val.data.SwitchDeptSignStr
			})
		);
		// 如果有Promeise，说明是中途插入认证，需要回调resolve来重新发起ajzx请求
		if (loginPromise) {
			loginPromise.resolve();
		} else if (loginNext && loginNext !== '/' && loginNext !== loginUrl()) {
			// 如果有指定的跳转url
			// / 和 login url本身，要跳向index页面
			store.dispatch(push(loginNext));
		} else {
			// 否则是转向默认的index页面
			store.dispatch(pushElement(val.data.IndexElement));
		}
	});
}
export function logout() {
	saveUserStore();
	// 从服务器上注销
	APIGet<void>('login', 'logout').then(() => {
		store.dispatch(push(loginUrl()));
		store.dispatch(actions.doLogout());
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
export function switchToDept(code: string, signStr: string) {
	APIPost<ISwitchDeptResult>('switchdept', 'switchToDept', signStr, { Dept: code }).then(val => {
		actions.doSwitchDept({
			dept: val.data.Dept,
			toRootDept: val.data.ToRootDept,
			nextLevelDept: val.data.NextLevelDept
		});
	});
}
