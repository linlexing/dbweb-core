import axios, { AxiosPromise } from 'axios';
import { resolve } from 'url';
export let RootPath: string = "/";
export function SetRootPath(val: string): void {
	RootPath = val;
}
export function APIGet<T>(eleName: string, methodName: string, signStr: string | null,
	param: any): AxiosPromise<T> {
	const header: any = { "dbweb-api": methodName };
	const params: any = {};
	if (param) {
		params._p = JSON.stringify(param);
	}
	if (signStr != null) {
		header._s = signStr;
	}
	const strURL = resolve(RootPath, eleName);
	return axios.get(strURL, {
		headers: header,
		params
	});
}

export function APIPost<T>(eleName: string, methodName: string, signStr: string,
	param: any): AxiosPromise<T> {
	const header: any = { "dbweb-api": methodName };
	if (signStr != null) {
		header._s = signStr;
	}
	return axios.post(resolve(RootPath, eleName), {
		data: param,
		headers: header
	});
}
