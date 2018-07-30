// tslint:disable:no-console
import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Main from '../main';
import * as reg from '../store';

export default () => (
	<Provider store={reg.store}>
		<ConnectedRouter history={reg.history}>
			<Main />
		</ConnectedRouter>
	</Provider>
);
