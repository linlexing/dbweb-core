import * as React from 'react';
import { connect } from 'react-redux';
import { IElement } from 'src/dbweb-core/model';
import * as urljoin from 'url-join';

import { apiRootPath } from '../../../store';

interface IProps {
    element: IElement;
    dept: string;
}
class Origin extends React.Component<IProps> {
    public shouldComponentUpdate(nextProps: IProps) {
        if (nextProps.dept !== this.props.dept) {
            return true;
        }
        return false;
    }
    public render() {
        return (
            <iframe
                key={this.props.dept}
                style={{ flexGrow: 1 }}
                src={urljoin(apiRootPath, this.props.element.Name, '?_s=' + this.props.element.SignStr)}
                frameBorder="none"
            />
        );
    }
}
export default connect((state: any) => ({ dept: state.root.dept.Code }))(Origin);
