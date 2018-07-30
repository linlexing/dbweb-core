import * as React from 'react';

import { ElementProvider } from '../eleContext';
import { IElement } from '../model';
import { modules } from '../store';
import Origin from './origin';
interface IProps {
	element: IElement;
}
class MainComponent extends React.PureComponent<IProps> {
	public render() {
		const { element } = this.props;
		const Mod = modules[element.Controller];
		return (
			<ElementProvider value={{ element }}>
				{Mod ? <Mod {...this.props} /> : <Origin element={element} />}
			</ElementProvider>
		);
	}
}
export default MainComponent;
