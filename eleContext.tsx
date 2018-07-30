import * as React from 'react';
import { Reducer } from 'redux';
import { IMessageMap } from './messages';
import { IElement } from './model';
const { Provider: ElementProvider, Consumer: ElementConsumer } = React.createContext({ element: {} as IElement });
export function withStatic(reducer?: Reducer, messages?: IMessageMap) {
	return (Component: React.ComponentClass) => {
		return class extends React.PureComponent {
			public static displayName = 'withReducer';
			public static reducer = reducer ? reducer : (state: any, action: any) => state;
			public static i118Messages = messages;
			public render() {
				return <Component {...this.props} />;
			}
		};
	};
}

export interface IElementComponent {
	element: IElement;
}
export { ElementProvider, ElementConsumer };
