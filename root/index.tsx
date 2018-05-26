// tslint:disable:no-console
import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { combineReducers, createStore, Store } from 'redux';

import { SetRootPath } from '../api';
import Main from '../main';
import home from '../main/home/reducer';
import { IModuleList } from '../model/module';
import root from './reducer';

interface IProps {
    modules: IModuleList
    apiRootPath: string
}

class Loader extends React.Component<IProps>{
    private store: Store
    constructor(props: IProps) {
        super(props)
        this.store = createStore(combineReducers({ root, home, login: props.modules.login.reducer }),
            {
                root: {
                    modules: props.modules,
                    apiRootPath: props.apiRootPath
                }
            });
    }

    public componentWillMount() {
        const { apiRootPath } = this.props
        SetRootPath(apiRootPath);
    }
    public render() {
        return (
            <Provider store={this.store} >
                <Router>
                    <Main />
                </Router>
            </Provider>
        );
    }
}

export default Loader