import * as React from 'react';
import { Reducer } from 'redux';

export interface IModule {
    name: string
    reducer: Reducer
    component: React.ComponentType
}
export interface IModuleList { [key: string]: IModule } 