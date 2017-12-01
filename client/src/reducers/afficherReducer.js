import * as actions from '../Actions'

export default function afiicherReducer(state = {}, action){
    switch(action.type){
        case actions.MODIFY_RENDER:
        return action.render;
        default:
            return state;
    }
};