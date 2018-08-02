import { ICategory } from './list';
export interface INode {
	readonly path: string;
	readonly key: string;
	readonly label: string;
	readonly labelEN: string;
	readonly icon?: string;
}
export interface IItem extends INode {
	readonly selected: boolean;
	readonly controller: string;
	readonly url: string;
}
export interface ICategory extends INode {
	readonly items: ReadonlyArray<IItem | ICategory>;
	readonly open: boolean;
}
export function isItem(pet: ICategory | IItem): pet is IItem {
	return (pet as IItem).url !== undefined;
}
export function setMenuOpenOrClose(tree: ICategory, splitpath: string[], open: boolean): ICategory {
	if (splitpath.length === 0) {
		throw Error('path is empty');
	}
	return {
		...tree,
		items: tree.items.map(val => {
			if (val.label === splitpath[0] && !isItem(val)) {
				if (splitpath.length === 1) {
					return { ...val, open };
				} else {
					return setMenuOpenOrClose(val, splitpath.slice(1), open);
				}
			}
			return val;
		})
	};
}
export class Category implements ICategory {
	public readonly open: boolean;
	public readonly key: string;
	public readonly label: string;
	public readonly labelEN: string;
	public readonly icon?: string;
	public readonly path: string;
	public readonly items: Array<IItem | ICategory>;
	constructor(key: string, label: string, labelEN: string, path: string, icon?: string) {
		this.open = false;
		this.key = key;
		this.label = label;
		this.labelEN = labelEN;
		this.path = path;
		this.icon = icon;
		this.items = [];
	}
	public findNode(label: string): ICategory | IItem | undefined {
		if (this.items.length > 0) {
			for (const val of this.items) {
				if (val.label === label) {
					return val;
				}
			}
		}
		return undefined;
	}
	public addNode(val: IItem | ICategory) {
		this.items.push(val);
	}
}
