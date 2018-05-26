import { createAction } from 'typesafe-actions';

const doOpenMenu = createAction('[home]open menu')
const doHideMenu = createAction('[home]close menu')
export { doOpenMenu, doHideMenu }