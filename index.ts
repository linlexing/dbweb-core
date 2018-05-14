import axios, { AxiosPromise } from 'axios';
export function APIGet<T>(eleName: string, methodName: string, signStr: string | null,
	param: any): AxiosPromise<T> {
	let header: any = { "dbweb-api": methodName };
	let params :any ={};
	if(param){
		params._p = JSON.stringify(param);
	}
	if (signStr != null) {
		header._s = signStr;
	}
	return axios.get("/" + eleName, {
		headers: header,
		params: params
	});
}

export function APIPost<T>(eleName: string, methodName: string, signStr: string,
	param: any): AxiosPromise<T> {
	let header: any = { "dbweb-api": methodName };
	if (signStr != null) {
		header._s = signStr;
	}
	return axios.post("/" + eleName, {
		headers: header,
		data: param
	});
}
