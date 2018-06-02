import * as React from "react";

import { ElementProvider } from "../../eleContext";
import { IElement } from "../../model";
import { modules } from "../../store";
import Origin from "./origin";
interface IProps {
    element: IElement;
}
export class MainComponent extends React.PureComponent<IProps> {
    public render() {
        const { element } = this.props;
        const Mod = modules[element.Controller];
        return (
            <ElementProvider value={{ element: element.Name }}>
                {Mod ? <Mod {...this.props} /> : <Origin element={element} />}
            </ElementProvider>
        );
    }
}
