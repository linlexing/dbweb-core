import * as React from "react";
import { IElement } from "src/dbweb-core/model";
import * as urljoin from "url-join";

import { apiRootPath } from "../../../store";

interface IProps {
    element: IElement;
}
export default class Origin extends React.Component<IProps> {
    public shouldComponentUpdate() {
        return false;
    }
    public render() {
        return (
            <iframe
                style={{ flexGrow: 1 }}
                src={urljoin(apiRootPath, this.props.element.Name, "?_s=" + this.props.element.SignStr)}
                frameBorder="none"
            />
        );
    }
}
