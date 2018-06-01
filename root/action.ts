import { createAction } from "typesafe-actions";

import { IElement } from "../model";

const doLoginedIniti = createAction("[root]doLoginedIniti", resolve => {
    return (data: { elements: IElement[]; userName: string }) => resolve(data);
});
const setDisplayLabel = createAction("[root]setDisplayLabel", resolve => {
    return (label: string) => resolve(label);
});
const doSetVersion = createAction("[root]doSetVersion", resolve => {
    return (ver: string) => resolve(ver);
});
const doSetMenu = createAction("[root]doSetMenu", resolve => {
    return (data: { path: string; openOrClose: boolean }) => resolve(data);
});

export { doLoginedIniti, doSetVersion, setDisplayLabel, doSetMenu };
