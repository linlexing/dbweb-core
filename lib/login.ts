
import { AxiosPromise } from 'axios';
import { APIGet } from '../api';
import { IElement } from '../model/element';
interface ILoginParam {
    userName: string;
    password: string;
}
export interface ILoginResult {
    IndexElement: string;
    Elements: IElement[];
}
export class Login {
    public static getPublicElement(): AxiosPromise<IElement[]> {
        return APIGet<IElement[]>("login", "getPublicElement", null, null);
    }

    public static login(param: ILoginParam): AxiosPromise<ILoginResult> {
        return APIGet<ILoginResult>("login", "login", null, param);
    }
}