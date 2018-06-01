import { createAction } from "typesafe-actions";

import { IElement } from "../model";

const doInitiElements = createAction("[root]doInitiElements", resolve => {
    return (elements: IElement[]) => resolve(elements);
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

export { doInitiElements, doSetVersion, setDisplayLabel, doSetMenu };
