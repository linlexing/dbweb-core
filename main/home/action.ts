import { createAction } from 'typesafe-actions';

const doOpenMenu = createAction('[home]open menu');
const doHideMenu = createAction('[home]close menu');
const doToggleUserMenu = createAction('[home]doToggleUserMenu', resolve => (open: boolean) => resolve(open));
const doOpenMenuList = createAction('[home]open menu list', resolve => {
    return (listKey: string) => resolve(listKey);
});
const doCloseMenuList = createAction('[home]close menu list', resolve => {
    return (listKey: string) => resolve(listKey);
});
export { doOpenMenu, doHideMenu, doOpenMenuList, doCloseMenuList, doToggleUserMenu };
