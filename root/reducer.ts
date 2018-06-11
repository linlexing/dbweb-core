import { ActionType, getType } from 'typesafe-actions';

import { elementRouterURL, IDept, IElement } from '../model';
import * as actions from './action';
import { Category, ICategory, isItem, setMenuOpenOrClose } from './list';

export interface IRootStore {
    readonly version: string;
    readonly projectLabel?: string;
    readonly logined?: boolean;
    readonly userName?: string;
    readonly dept?: IDept;
    readonly brand?: string;
    readonly serviceVersion?: number;
    readonly publicEles?: ReadonlyArray<IElement>;
    readonly elements?: ReadonlyArray<IElement>;
    readonly menus?: ICategory;
    readonly toRootDept?: IDept[];
    readonly nextLevelDept?: IDept[];
    readonly switchDeptSignStr?: string;
}
function pathJoin(dir: string, name: string) {
    return dir === '' ? name : dir + '/' + name;
}
// 根据ele返回菜单项，自动根据category生成层次结构
function buildMenusFromElements(eles: IElement[]): ICategory {
    const tree = new Category('root', 'root', '');
    let keyNum = 0;
    const addnode = (obj: IElement) => {
        const splitpath = obj.Category.replace(/^\/|\/$/g, '').split('/');
        let ptr = tree;
        for (const val of splitpath) {
            let node = ptr.findNode(val) as Category;
            if (!node) {
                node = new Category((keyNum++).toString(), val, pathJoin(ptr.path, val));
                ptr.addNode(node);
            }
            ptr = node;
        }
        return ptr;
    };
    eles.sort((a, b) => (a.Category + '/' + a.Label).localeCompare(b.Category + '/' + b.Label)).forEach(val => {
        const c = addnode(val);
        c.addNode({
            label: val.Label,
            key: (keyNum++).toString(),
            url: elementRouterURL(val.Name),
            controller: val.Controller,
            path: pathJoin(c.path, val.Label),
            selected: false
        });
    });
    // 第一层要打开
    return {
        ...tree,
        items: tree.items.map(val => {
            if (isItem(val)) {
                return val;
            } else {
                return {
                    ...val,
                    open: true
                };
            }
        })
    };
}
const root = (state: IRootStore = { version: '0' }, action: Actions): IRootStore => {
    switch (action.type) {
        case getType(actions.doSetVersion):
            return {
                ...state,
                version: action.payload
            };
        case getType(actions.doLoginedIniti):
            return {
                ...state,
                elements: action.payload.elements,
                menus: buildMenusFromElements(action.payload.elements),
                userName: action.payload.userName,
                dept: action.payload.dept,
                logined: true,
                serviceVersion: action.payload.version,
                brand: action.payload.brand,
                toRootDept: action.payload.toRootDept,
                nextLevelDept: action.payload.nextLevelDept,
                switchDeptSignStr: action.payload.switchDeptSignStr
            };
        case getType(actions.setProjectLabel):
            return {
                ...state,
                projectLabel: action.payload
            };
        case getType(actions.doSetMenu):
            return {
                ...state,
                menus: setMenuOpenOrClose(
                    state.menus as ICategory,
                    action.payload.path.replace(/^\/|\/$/g, '').split('/'),
                    action.payload.openOrClose
                )
            };
        case getType(actions.doLogout):
            return {
                version: state.version,
                publicEles: state.publicEles,
                projectLabel: state.projectLabel
            };
        case getType(actions.doSwitchDept):
            return {
                ...state,
                dept: action.payload.dept,
                toRootDept: action.payload.toRootDept,
                nextLevelDept: action.payload.nextLevelDept
            };
        default:
            return state;
    }
};
type Actions = ActionType<typeof actions>;
export default root;
