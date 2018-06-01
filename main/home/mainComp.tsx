import * as React from "react";

import { ElementProvider } from "../../eleContext";
import { IElement } from "../../model";
import { modules, registerReducer } from "../../store";

export function MainComponent(element: IElement) {
    const module = modules[element.Controller];
    class Rev extends React.PureComponent {
        public componentWillMount() {
            if (module) {
                registerReducer(element.Name, module.reducer);
            }
        }
        public render() {
            const Mod = module ? module.component : undefined;
            return (
                <ElementProvider value={element.Name}>
                    {Mod ? (
                        <Mod {...this.props} />
                    ) : (
                        <div>
                            the element {element.Name} can't found the controller:{element.Controller}
                        </div>
                    )}
                </ElementProvider>
            );
        }
    }
    return Rev;
}
