import * as React from "react";
import { ElementConsumer } from "./eleContext";
interface IElementProps {
    element: string;
    [key: string]: any;
}
export function withElement(Component: React.ComponentClass<IElementProps>) {
    return class extends React.PureComponent {
        public static displayName = "withElement";
        public render() {
            const p = this.props;
            const Comp = (props: { element: string }) => <Component {...p} element={props.element} />;
            // ... and renders the wrapped component with the context element
            // Notice that we pass through any additional props as well
            return <ElementConsumer>{Comp}</ElementConsumer>;
        }
    };
}
