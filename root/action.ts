import { createAction } from 'typesafe-actions';

import { IDept, IElement } from '../model';

const doLoginedIniti = createAction('[root]doLoginedIniti', resolve => {
    return (data: { elements: IElement[]; userName: string; dept: IDept; brand: string; version: number }) =>
        resolve(data);
});
const setDisplayLabel = createAction('[root]setDisplayLabel', resolve => {
    return (label: string) => resolve(label);
});
const doSetVersion = createAction('[root]doSetVersion', resolve => {
    return (ver: string) => resolve(ver);
});
const doSetMenu = createAction('[root]doSetMenu', resolve => {
    return (data: { path: string; openOrClose: boolean }) => resolve(data);
});

export { doLoginedIniti, doSetVersion, setDisplayLabel, doSetMenu };
