// tslint:disable:no-console
import {
    AppBar,
    Badge,
    ClickAwayListener,
    Divider,
    Drawer,
    Grow,
    Icon,
    IconButton,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Toolbar,
    Tooltip,
    Typography,
    WithStyles
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import { Manager, Popper, Target } from 'react-popper';
import { connect } from 'react-redux';
import { Switch } from 'react-router';
import { Link, Route, RouteComponentProps } from 'react-router-dom';
import { compose } from 'redux';
import { logout } from 'src/dbweb-core/login';

import { elementRouterURL, IDept, IElement } from '../../model';
import * as actions from './action';
import DeptList from './deptList';
import { clearText } from './lib';
import { MainComponent } from './mainComp';
import Menus from './menus';
import { NotFound } from './notfound';
import { IHomeStore } from './reducer';
import { clsNames, styles } from './style';

interface IHomeEvents {
    openMenu: () => any;
    hideMenu: () => any;
    toggleUserMenu: (open: boolean) => any;
}
interface IHomeProps extends IHomeEvents, IHomeStore, RouteComponentProps<any>, WithStyles<clsNames> {
    projectLabel: string;
    menuOpen: boolean;
    publicEles: IElement[];
    elements: IElement[];
    userName: string;
    dept: IDept;
    toRootDept: IDept[];
    nextLevelDept: IDept[];
    serviceVersion: number;
    brand: string;
    selElement: IElement;
}
const mapStateToProps = (state: any) => ({
    ...state.home,
    userName: state.root.userName,
    elements: state.root.elements,
    publicEles: state.root.publicEles,
    projectLabel: state.root.displayLabel,
    dept: state.root.dept,
    brand: state.root.brand,
    serviceVersion: state.root.serviceVersion,
    toRootDept: state.root.toRootDept,
    nextLevelDept: state.root.nextLevelDept
});
const mapDispatchToProps = {
    openMenu: actions.doOpenMenu,
    hideMenu: actions.doHideMenu,
    toggleUserMenu: actions.doToggleUserMenu
};

class Home extends React.PureComponent<IHomeProps> {
    private target: React.RefObject<HTMLDivElement>;
    constructor(props: IHomeProps) {
        super(props);
        this.hideUserMenu = this.hideUserMenu.bind(this);
        this.toggleUserMenu = this.toggleUserMenu.bind(this);

        this.logout = this.logout.bind(this);
        this.target = React.createRef();
    }
    public render() {
        const {
            menuOpen,
            userMenuOpen,
            classes,
            theme,
            elements,
            publicEles,
            projectLabel,
            openMenu,
            hideMenu,
            userName,
            dept,
            brand,
            serviceVersion,
            nextLevelDept,
            toRootDept
        } = this.props;
        const selEleName = location.pathname.split('/');
        let selEle;
        // let userBtn;
        // if (this.userButton.current) {
        //     userBtn = this.userButton.current;
        // }
        if (selEleName.length > 2) {
            selEle = _.find(elements, { Name: decodeURIComponent(selEleName[2]) });
            if (!selEle) {
                selEle = _.find(publicEles, { Name: decodeURIComponent(selEleName[2]) });
            }
        }
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
                        <Typography variant="title" color="inherit" noWrap={true} className={classes.toolbarText}>
                            {selEle ? clearText(selEle.Label) : 'not found'}
                        </Typography>

                        <Manager>
                            <Target>
                                <div ref={this.target}>
                                    <Tooltip title={userName + ' ' + dept.Code + '.' + dept.Name}>
                                        <IconButton color="inherit" onClick={this.toggleUserMenu}>
                                            <Icon>account_circle</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </Target>
                            <Popper placement="bottom-end" eventsEnabled={userMenuOpen}>
                                <ClickAwayListener onClickAway={this.hideUserMenu}>
                                    <Grow in={userMenuOpen} style={{ transformOrigin: '0 0 0' }}>
                                        <Paper id="menu-list-collapse">
                                            <MenuList role="menu">
                                                <MenuItem onClick={this.logout}>
                                                    <ListItemIcon>
                                                        <Icon>exit_to_app</Icon>
                                                    </ListItemIcon>
                                                    <ListItemText primary="退出系统" inset={true} />
                                                </MenuItem>
                                                {nextLevelDept.map(val => <DeptList key={val.Code} dept={val} />)}
                                                {toRootDept.length > 0 ? <Divider /> : null}
                                                {toRootDept.length > 0
                                                    ? toRootDept.map(val => <DeptList key={val.Code} dept={val} />)
                                                    : null}
                                            </MenuList>
                                        </Paper>
                                    </Grow>
                                </ClickAwayListener>
                            </Popper>
                        </Manager>
                        <IconButton color="inherit" style={{ marginRight: menuOpen ? 0 : 24 }}>
                            <Badge badgeContent={4} color="secondary">
                                <Icon>notifications</Icon>
                            </Badge>
                        </IconButton>
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
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                paddingLeft: 20,
                                color: theme ? theme.palette.grey['600'] : undefined
                            }}>
                            <Typography
                                variant="title"
                                color="inherit"
                                noWrap={true}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyItems: 'center',
                                    marginBottom: 4,
                                    fontWeight: theme ? theme.typography.fontWeightRegular : undefined
                                }}>
                                <Icon>{brand}</Icon>
                                <span>{projectLabel}</span>
                            </Typography>
                            <Typography variant="caption" color="inherit" noWrap={true}>
                                版本:<Link
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                    to={elementRouterURL('version')}>
                                    {serviceVersion}
                                </Link>
                            </Typography>
                        </div>
                        <IconButton onClick={hideMenu} style={{ color: theme && theme.palette.grey['500'] }}>
                            {theme && theme.direction === 'rtl' ? (
                                <Icon>chevron_right</Icon>
                            ) : (
                                <Icon>chevron_left</Icon>
                            )}
                        </IconButton>
                    </div>
                    <Divider />
                    <Menus />
                </Drawer>
                <main
                    className={classNames(classes.content, classes[`content-left`], {
                        [classes.contentShift]: menuOpen,
                        [classes['contentShift-left']]: menuOpen
                    })}>
                    <div className={classes['content-top']} />
                    <Switch>
                        {elements &&
                            _.union(publicEles, elements).map<JSX.Element>(
                                (val): any => {
                                    return (
                                        <Route key={val.Name} path={'/front/' + val.Name}>
                                            <MainComponent element={val} />
                                        </Route>
                                    );
                                }
                            )}
                        <Route key="not found" component={NotFound} />
                    </Switch>
                </main>
            </div>
        );
    }
    private hideUserMenu(event: any) {
        if (this.target.current && this.target.current.contains(event.target)) {
            return;
        }
        this.props.toggleUserMenu(false);
    }
    private toggleUserMenu() {
        this.props.toggleUserMenu(!this.props.userMenuOpen);
    }
    private logout() {
        this.props.toggleUserMenu(false);
        logout();
    }
}
export default compose(
    withStyles(styles, { withTheme: true }),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Home);
