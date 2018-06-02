import * as React from "react";
import { Reducer } from "redux";
const { Provider: ElementProvider, Consumer } = React.createContext("");
export function withElement(Component: React.ComponentClass) {
    return (props: any) => {
        // ... and renders the wrapped component with the context element
        // Notice that we pass through any additional props as well
        return <Consumer>{element => <Component {...props} element={element} />}</Consumer>;
    };
}
// This function takes a component...
export function withReducer(reducer: Reducer) {
    return (Component: React.ComponentClass) => {
        return class WithReducer extends React.PureComponent {
            public static reducer = reducer;
            public render() {
                return <Component {...this.props} />;
            }
        };
    };
}

export interface IElementComponent {
    element: string;
}
export { ElementProvider };
