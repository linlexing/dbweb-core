// tslint:disable:no-console
import * as React from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import { loginUrl } from "../login";
import { modules } from "../store";
import Home from "./home";

const Main: React.SFC = () => {
    const ilogin = modules.login;
    if (ilogin) {
        const InnerLogin = ilogin.component;
        const CompLogin = (props: any) => <InnerLogin {...props} />;
        return (
            <Switch>
                <Route key="login" path={loginUrl()} component={CompLogin} />
                <Route key="other" component={Home} />
            </Switch>
        );
    } else {
        return <div>error not found login module</div>;
    }
};

export default withRouter(Main);
