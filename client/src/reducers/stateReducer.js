import * as actions from '../Actions'

export default function stateReducer(state = {}, action){
    switch(action.type){
        case actions.MODIFY_STATE:
        console.log(action);
        console.log(state);
        return Object.assign({},state,{state: action.stateApp});
        default:
            return state;
    }
};