import * as React from 'react';
import { Reducer } from 'redux';
import { IElement } from './model';
const { Provider: ElementProvider, Consumer: ElementConsumer } = React.createContext({ element: {} as IElement });
// export function withElement(Component: React.ComponentClass) {
//     return  return class extends React.PureComponent {
//         public static displayName = "withElement";
//         // ... and renders the wrapped component with the context element
//         // Notice that we pass through any additional props as well
//         public render(){
//         return <Consumer>{(p: { element: string }) => <Component {...props} element={p.element} />}</Consumer>;
//         }
//     };
// }
// This function takes a component...
export function withReducer(reducer?: Reducer) {
    return (Component: React.ComponentClass) => {
        return class extends React.PureComponent {
            public static displayName = 'withReducer';
            public static reducer = reducer ? reducer : (state: any, action: any) => state;
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
