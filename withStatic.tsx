import * as React from 'react';
import { Reducer } from 'redux';
import { IMessageMap } from './messages';

export default function withStatic(reducer?: Reducer, messages?: IMessageMap) {
	return (Component: React.ComponentClass) => {
		return class extends React.PureComponent {
			public static displayName = 'withStatic';
			public static reducer = reducer ? reducer : (state: any, action: any) => state;
			public static i18nMessages = messages;
			public render() {
				return <Component {...this.props} />;
			}
		};
	};
}
