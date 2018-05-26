// tslint:disable:no-console
import * as React from 'react';
import { connect } from 'react-redux';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';

import { Login } from '../lib/login';
import { IElement } from '../model/element';
import { IModuleList } from '../model/module';
import * as actions from '../root/action';
import Home from './home';

interface IMainProps extends RouteComponentProps<any> {
    modules: IModuleList
    doAssignElements: (eles: IElement[]) => any
}
class Main extends React.Component<IMainProps>{
    public componentWillMount(): void {
        Login.getPublicElement().then((eles) => {
            this.props.doAssignElements(eles.data)
        });
    }
    public render() {
        const { modules } = this.props;
        const ilogin = modules.login
        if (ilogin) {
            const InnerLogin = ilogin.component;
            const CompLogin = (props: any) => <InnerLogin {...props} />
            return (
                <Switch>
                    <Route key="login" path="/front/login" component={CompLogin} />
                    <Route key="other" component={Home} />
                </Switch>
            );

        } else {
            return <div>error not found login module</div>
        }
    }
}
const mapStateToProps = (state: any) => ({ modules: state.root.modules })
const mapDispatchToProps = {
    doAssignElements: actions.doAssignElements,
};
// export default connect<{ modules: IModuleList }, { doAssignElements: (eles: IElement[]) => any }>(mapStateToProps, mapDispatchToProps)(withRouter(Main))

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main))