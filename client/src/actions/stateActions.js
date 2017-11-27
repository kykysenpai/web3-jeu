import * as states from '../AppState'

export function modifyAppState(stateApp){
    return { type: states.MODIFY_STATE, stateApp}
}