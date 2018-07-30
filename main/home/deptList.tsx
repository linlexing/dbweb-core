import { Icon, ListItemIcon, ListItemText } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import * as React from 'react';
import { connect } from 'react-redux';
import { IDept } from '../../model';

import * as rootActions from '../../root/action';
import * as actions from './action';

interface IProps {
	signStr: string;
	dept: IDept;
	toggleUserMenu: (open: boolean) => any;
	switchToDept: (dept: string, signStr: string) => any;
}
class DeptList extends React.PureComponent<IProps> {
	constructor(props: IProps) {
		super(props);
		this.switchDept = this.switchDept.bind(this);
	}
	public render() {
		const { dept } = this.props;
		return (
			<MenuItem onClick={this.switchDept}>
				<ListItemIcon>
					<Icon>chevron_right</Icon>
				</ListItemIcon>
				<ListItemText inset={true} primary={dept.Code + '.' + dept.Name} />
			</MenuItem>
		);
	}
	private switchDept() {
		this.props.toggleUserMenu(false);
		setTimeout(() => {
			this.props.switchToDept(this.props.dept.Code, this.props.signStr);
		}, 300);
	}
}
const mapState = (state: any, ownProps: any) => ({
	dept: ownProps.dept,
	signStr: state.root.switchDeptSignStr
});
const mapDispatch = {
	toggleUserMenu: actions.doToggleUserMenu,
	switchToDept: rootActions.switchToDept
};
export default connect(
	mapState,
	mapDispatch
)(DeptList);
