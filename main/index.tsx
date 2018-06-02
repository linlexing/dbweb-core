// tslint:disable:no-console
import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import { Route, Switch, withRouter } from "react-router-dom";
import { compose } from "redux";

import { loginUrl } from "../login";
import { IElement } from "../model";
import { IRootStore } from "../root/reducer";
import Home from "./home";
import { MainComponent } from "./home/mainComp";

interface IProps {
    elements: IElement[];
}
const Main: React.SFC<IProps> = props => {
    const eLogin = _.find(props.elements, { Name: "login" });
    if (eLogin) {
        const InnerLogin = MainComponent(eLogin);

        return (
            <Switch>
                <Route key="login" path={loginUrl()} component={InnerLogin} />
                <Route key="other" component={Home} />
            </Switch>
        );
    } else {
        return <div>error not found login module</div>;
    }
};

export default compose(withRouter, connect((state: any) => ({ elements: (state.root as IRootStore).publicEles })))(
    Main
);
