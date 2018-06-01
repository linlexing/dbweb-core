// tslint:disable:no-console
import {
    AppBar,
    Divider,
    Drawer,
    Icon,
    IconButton,
    Toolbar,
    Typography,
    WithStyles,
    withStyles
} from "@material-ui/core";
import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { Switch } from "react-router";
import { Route, RouteComponentProps } from "react-router-dom";
import { compose } from "redux";

import { IElement } from "../../model";
import * as actions from "./action";
import { MainComponent } from "./mainComp";
import Menus from "./menus";
import { NotFound } from "./notfound";
import { IHomeStore } from "./reducer";
import { clsNames, styles } from "./style";

interface IHomeEvents {
    openMenu: () => any;
    hideMenu: () => any;
}
interface IHomeProps extends IHomeEvents, IHomeStore, RouteComponentProps<any>, WithStyles<clsNames> {
    projectLabel: string;
    menuOpen: boolean;
    elements: IElement[];
}
const mapStateToProps = (state: any) => ({
    ...state.home,
    elements: state.root.elements,
    projectLabel: state.root.displayLabel
});
const mapDispatchToProps = {
    openMenu: actions.doOpenMenu,
    hideMenu: actions.doHideMenu
};

const Home: React.SFC<IHomeProps> = props => {
    const { menuOpen, classes, theme, elements, projectLabel, openMenu, hideMenu } = props;
    return (
        <div className={classes.appFrame}>
            <AppBar
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: menuOpen
                })}>
                <Toolbar disableGutters={!menuOpen}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={openMenu}
                        className={classNames(classes.menuButton, menuOpen && classes.hide)}>
                        <Icon>menu</Icon>
                    </IconButton>
                    <Typography variant="title" color="inherit" noWrap={true}>
                        {projectLabel}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                anchor="left"
                open={menuOpen}
                classes={{
                    paper: classes.drawerPaper
                }}>
                <div className={classes.drawerHeader}>
                    <IconButton onClick={hideMenu} style={{ color: "inherit" }}>
                        {theme && theme.direction === "rtl" ? <Icon>chevron_right</Icon> : <Icon>chevron_left</Icon>}
                    </IconButton>
                </div>
                <Divider />
                <Menus />
            </Drawer>
            )
            <main
                className={classNames(classes.content, classes[`content-left`], {
                    [classes.contentShift]: menuOpen,
                    [classes["contentShift-left"]]: menuOpen
                })}>
                <div className={classes["content-top"]} />
                <Switch>
                    {elements &&
                        elements.map<JSX.Element>((val): any => {
                            const Comp = MainComponent(val);
                            return <Route key={val.Name} path={"/front/" + val.Name} component={Comp} />;
                        })}
                    <Route key="not found" component={NotFound} />
                </Switch>
            </main>
        </div>
    );
};
export default compose(
    // withRouter,
    withStyles(styles, { withTheme: true }),
    connect(mapStateToProps, mapDispatchToProps)
)(Home);
