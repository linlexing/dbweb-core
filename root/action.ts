import { Dispatch } from 'redux';
import { createAction } from 'typesafe-actions';
import { APIPost } from '../api';
import { IDept, IElement } from '../model';

const doLogout = createAction('[root]doLogout');
const doLoginedIniti = createAction('[root]doLoginedIniti', resolve => {
	return (data: {
		elements: IElement[];
		userName: string;
		dept: IDept;
		brand: string;
		version: number;
		toRootDept: IDept[];
		nextLevelDept: IDept[];
		switchDeptSignStr: string;
	}) => resolve(data);
});
const doSwitchDept = createAction('[root]doSwitchDept', resolve => {
	return (data: { dept: IDept; toRootDept: IDept[]; nextLevelDept: IDept[] }) => resolve(data);
});
const setProjectLabel = createAction('[root]setProjectLabel', resolve => {
	return (val: string) => resolve(val);
});
const doSetVersion = createAction('[root]doSetVersion', resolve => {
	return (ver: string) => resolve(ver);
});
const doSetMenu = createAction('[root]doSetMenu', resolve => {
	return (data: { path: string; openOrClose: boolean }) => resolve(data);
});
const doSetLanguage = createAction('[root]doSetLanguage', resolve => {
	return (lang: string) => resolve(lang);
});

interface ISwitchDeptResult {
	Dept: IDept;
	ToRootDept: IDept[];
	NextLevelDept: IDept[];
}
const switchToDept = (code: string, signStr: string) => {
	return (dispatch: Dispatch) => {
		APIPost<ISwitchDeptResult>('switchdept', 'switchToDept', signStr, { Dept: code }).then(val => {
			dispatch(
				doSwitchDept({
					dept: val.data.Dept,
					toRootDept: val.data.ToRootDept,
					nextLevelDept: val.data.NextLevelDept
				})
			);
		});
	};
};

export {
	doLoginedIniti,
	doSetVersion,
	setProjectLabel,
	doSetMenu,
	doLogout,
	doSwitchDept,
	switchToDept,
	doSetLanguage
};
