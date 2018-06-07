import axios, { AxiosPromise } from 'axios';
import { resolve } from 'url';

import { showLogin } from './login';
import { apiRootPath } from './store';

axios.interceptors.response.use(undefined, error => {
    const originalRequest = error.config;
    // 如果是未认证，则需要跳转到登录页进行认证
    if (error.response.status === 401) {
        return showLogin()
            .then(() => {
                return axios(originalRequest);
            })
            .catch(err => {
                // tslint:disable:no-console
                console.log(err);
                alert('not login');
            });
    }
    return Promise.reject(error);
});
export function APIGet<T>(eleName: string, methodName: string, signStr?: string, param?: any): AxiosPromise<T> {
    const header: any = { 'dbweb-api': methodName };
    const params: any = {};
    if (param) {
        params._p = JSON.stringify(param);
    }
    if (signStr != null) {
        header._s = signStr;
    }
    const strURL = resolve(apiRootPath, eleName);
    return axios.get(strURL, {
        withCredentials: true,
        headers: header,
        params
    });
}

export function APIPost<T>(eleName: string, methodName: string, signStr?: string, param?: any): AxiosPromise<T> {
    const header: any = { 'dbweb-api': methodName };
    if (signStr != null) {
        header._s = signStr;
    }
    return axios.post(resolve(apiRootPath, eleName), param, {
        withCredentials: true,
        headers: header
    });
}
