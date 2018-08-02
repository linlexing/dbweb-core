import { elementRouterURL, IElement } from 'src/dbweb-core/model';
import { Category, ICategory, isItem } from 'src/dbweb-core/root/list';
function pathJoin(dir: string, name: string) {
	return dir === '' ? name : dir + '/' + name;
}
// 根据ele返回菜单项，自动根据category生成层次结构
function buildMenusFromElements(eles: IElement[]): ICategory {
	const tree = new Category('root', 'root', 'root', '');
	let keyNum = 0;
	const addnode = (obj: IElement) => {
		// 去除头尾的斜杠
		const splitpath = obj.Category.replace(/^\/|\/$/g, '').split('/');
		const splitpathEN = obj.CategoryEN.replace(/^\/|\/$/g, '').split('/');
		let ptr = tree;
		// tslint:disable-next-line:prefer-for-of
		for (let idx = 0; idx < splitpath.length; idx++) {
			const val = splitpath[idx];
			let valEN: string = val;
			if (splitpathEN.length > idx) {
				valEN = splitpathEN[idx];
			}
			let node = ptr.findNode(val) as Category;
			if (!node) {
				node = new Category((keyNum++).toString(), val, valEN, pathJoin(ptr.path, val));
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
			labelEN: val.LabelEN ? val.LabelEN || val.Label : val.Label,
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
export default buildMenusFromElements;
