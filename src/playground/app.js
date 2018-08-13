import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { store } from './redux/store';

import { ConnectedPlayground } from './playground.component';

const App = () => (
  <Provider store={store}>
    <ConnectedPlayground />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
