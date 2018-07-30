import * as _ from 'lodash';

// 多国语言存贮的地方
export interface IMessage {
	[key: string]: any;
}
export interface IMessageMap {
	[lang: string]: IMessage;
}
const allMessages: IMessageMap = {};
// 注册一个控件的多国语言
export function registerLanguage(mes: IMessageMap) {
	_.forEach(mes, (v, k) => {
		allMessages[k] = { ...allMessages[k], ...v };
	});
}
export function getLanguageMessages(lang: string): IMessage {
	return allMessages[lang];
}
