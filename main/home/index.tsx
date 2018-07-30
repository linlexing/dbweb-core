// tslint:disable:no-console
import {
	AppBar,
	Badge,
	Divider,
	Drawer,
	Icon,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	MenuList,
	Toolbar,
	Tooltip,
	Typography,
	WithStyles
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import * as classNames from 'classnames';
import * as _ from 'lodash';
import * as React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router';
import { Link, Route, RouteComponentProps } from 'react-router-dom';
import { compose } from 'redux';
import { logout } from '../../login';
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
	userMenuOpen: boolean;
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
	projectLabel: state.root.projectLabel,
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
interface IStates {
	anchorEl: HTMLElement | null;
}
class Home extends React.PureComponent<IHomeProps, IStates> {
	constructor(props: IHomeProps) {
		super(props);
		this.state = {
			anchorEl: null
		};
		this.onUserIconClick = this.onUserIconClick.bind(this);
		this.onUserMenuClose = this.onUserMenuClose.bind(this);
		this.logout = this.logout.bind(this);
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
		const { anchorEl } = this.state;
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

						<Tooltip title={userName + ' ' + dept.Code + '.' + dept.Name}>
							<IconButton color="inherit" onClick={this.onUserIconClick}>
								<Icon>account_circle</Icon>
							</IconButton>
						</Tooltip>
						<Menu
							id="userMenu"
							anchorEl={anchorEl}
							open={userMenuOpen}
							onClose={this.onUserMenuClose}
							anchorReference="anchorEl"
							getContentAnchorEl={undefined} // 这一行必须要加，参见：https://github.com/mui-org/material-ui/issues/10804
							anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
							disableAutoFocusItem={true}>
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
						</Menu>
						<IconButton color="inherit">
							<Badge badgeContent={4} color="secondary">
								<Icon>notifications</Icon>
							</Badge>
						</IconButton>
						<IconButton color="inherit" style={{ marginRight: menuOpen ? 0 : 24 }}>
							<Icon>language</Icon>
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
								<Icon>{brand.length > 0 ? brand : 'home'}</Icon>
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

	private onUserIconClick(event: React.MouseEvent<HTMLElement>) {
		if (!this.props.userMenuOpen) {
			this.setState({ anchorEl: event.currentTarget });
		} else {
			this.setState({ anchorEl: null });
		}
		this.props.toggleUserMenu(!this.props.userMenuOpen);
	}
	private logout() {
		this.props.toggleUserMenu(false);
		logout();
	}
	private onUserMenuClose() {
		this.setState({ anchorEl: null });
		this.props.toggleUserMenu(false);
	}
}
export default compose(
	withStyles(styles, { withTheme: true }),
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(Home);
