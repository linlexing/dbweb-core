import * as React from "react";
import { Reducer } from "redux";

export interface IElement {
    Name: string;
    Label: string;
    Category: string;
    Controller: string;
    NewWindow: boolean;
    SignStr?: string;
}
export interface IModule {
    reducer: Reducer;
    component: React.ComponentType;
}
export interface IModuleList {
    [key: string]: IModule;
}
export function elementRouterURL(eleName: string): string {
    return "/front/" + encodeURIComponent(eleName);
}
