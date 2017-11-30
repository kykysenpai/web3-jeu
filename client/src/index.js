import React from 'react';
import {render} from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import * as states from './AppState'


const state = {
    state:states.HOME,
    afficher:states.HOME,
    player: {}
};
const store = configureStore(state);

render(
<Provider store={store}>
<App />
</Provider>, document.getElementById('appDiv'));registerServiceWorker();
