import * as React from 'react';
import { IElement } from './model';
const { Provider: ElementProvider, Consumer: ElementConsumer } = React.createContext({ element: {} as IElement });

export interface IElementComponent {
	element: IElement;
}
export { ElementProvider, ElementConsumer };
