// tslint:disable:no-console
import * as _ from 'lodash';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { loginUrl } from '../login';
import { getLanguageMessages } from '../messages';
import { IElement } from '../model';
import { IRootStore } from '../root/reducer';
import { modules } from '../store';
import Content from './content';

interface IProps {
	elements: IElement[];
	language: string;
}

const Main: React.SFC<IProps> = props => {
	const eLogin = _.find(props.elements, { Name: 'login' });
	const { language } = props;
	let child = <div>error not found login module</div>;
	if (eLogin) {
		child = (
			<Switch>
				<Route key="login" path={loginUrl()}>
					<Content element={eLogin} />
				</Route>
				<Route key="other" component={modules.home} />
			</Switch>
		);
	}
	return (
		<IntlProvider key={language} locale={getLocale(language)} messages={getLanguageMessages(language)}>
			{child}
		</IntlProvider>
	);
};
function getLocale(name: string): string {
	const ns = name.split('-');
	return ns[0];
}
export default compose(
	withRouter,
	connect((state: any) => ({
		elements: (state.root as IRootStore).publicEles,
		language: (state.root as IRootStore).language ? (state.root as IRootStore).language : navigator.language
	}))
)(Main);
