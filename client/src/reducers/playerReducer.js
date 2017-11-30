import * as actions from '../Actions'

export default function playerReducer(state = {}, action){
    switch(action.type){
        case actions.LOAD_PLAYER:
        console.log(action);
        console.log(state);
        return state;
        default:
            return state;
    }
};