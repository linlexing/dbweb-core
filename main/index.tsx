// tslint:disable:no-console
import * as _ from 'lodash';
import * as React from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { getLanguageMessages } from 'src/dbweb-core/messages';
import { loginUrl } from '../login';
import { IElement } from '../model';
import { IRootStore } from '../root/reducer';
import Home from './home';
import { MainComponent } from './home/mainComp';

interface IProps {
	elements: IElement[];
	language: string;
}

const Main: React.SFC<IProps> = props => {
	const eLogin = _.find(props.elements, { Name: 'login' });
	const { language } = props;
	console.log(language, getLanguageMessages(language));
	let child = <div>error not found login module</div>;
	if (eLogin) {
		child = (
			<Switch>
				<Route key="login" path={loginUrl()}>
					<MainComponent element={eLogin} />
				</Route>
				<Route key="other" component={Home} />
			</Switch>
		);
	}
	return (
		<IntlProvider locale={getLocale(language)} messages={getLanguageMessages(language)}>
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
