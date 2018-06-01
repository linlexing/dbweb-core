import * as React from "react";
const { Provider: ElementProvider, Consumer } = React.createContext("");
// This function takes a component...
export function withElement(Component: React.ComponentClass) {
    // ...and returns another component...
    return function ElementComponent(props: any) {
        // ... and renders the wrapped component with the context element
        // Notice that we pass through any additional props as well
        return <Consumer>{element => <Component {...props} element={element} />}</Consumer>;
    };
}
export interface IElementComponent {
    element: string;
}
export { ElementProvider };
