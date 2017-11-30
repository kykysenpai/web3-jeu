import {combineReducers} from 'redux';
import state from './stateReducer';
import player from './playerReducer';
import afficher from './afficherReducer';

const rootReducer = combineReducers({
    state,
    afficher,
    player
});

export default rootReducer;