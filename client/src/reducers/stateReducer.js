import * as states from '../AppState'

export default function stateReducer(state = {}, action){
    switch(action.type){
        case states.MODIFY_STATE:
            var tmpState = state;
            tmpState = action.stateApp;
            return tmpState;
        default:
            return state;
    }
};