import React from 'react';
import {render} from 'react-dom';
import App from './App';
import { unregister } from './registerServiceWorker';

unregister();
render(<App />, document.getElementById('appDiv'));
