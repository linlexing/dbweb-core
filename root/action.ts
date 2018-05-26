import { createAction } from 'typesafe-actions';

import { IElement } from '../model/element';
import { IModuleList } from '../model/module';
const doIniti = createAction('initi', resolve => {
    return (data: {
        modules: IModuleList,
        apiRootPath: string
    }) => resolve(data);
})

const doAssignElements = createAction('doAssignElements', resolve => {
    return (elements: IElement[]) => resolve(elements);
})

const doSetIndex = createAction('doSetIndex', resolve => {
    return (index: string) => resolve(index);
})

export { doIniti, doAssignElements, doSetIndex }