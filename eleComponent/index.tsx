import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
interface IOptions {
    element: string;
    reducer?: (state: any, action: any) => any;
    mapStateToProps?: (state: any, element: string, ownProps?: any) => any;
    mapDispatchToProps?: (dispatch: Dispatch, element: string, ownProps?: any) => any;
}
export const eleComponent = ({ element, mapStateToProps, mapDispatchToProps }: IOptions = { element: "" }) => <
    TOriginalProps extends {}
>(
    Component: React.ComponentType<TOriginalProps>
) => {
    const result = class EleComponent extends React.PureComponent<TOriginalProps> {
        // Define how your HOC is shown in ReactDevTools
        public static displayName = `dbweb-elecomp(${Component.displayName || Component.name})`;

        // Implement other methods here

        public render() {
            // Render all your added markup
            return (
                <div>
                    {/* render the wrapped component like this, passing the props and state */}
                    <Component {...this.props} {...this.state} />
                </div>
            );
        }
    };
    let mapState: any;
    if (mapStateToProps) {
        mapState = (state: any, ownProps: any) => mapStateToProps(state, element, ownProps);
    }
    if (mapDispatchToProps) {
        return connect(mapState, (dispatch: Dispatch, ownProps: any) =>
            mapDispatchToProps(dispatch, element, ownProps)
        )(result);
    } else {
        return connect(mapState)(result);
    }
};
