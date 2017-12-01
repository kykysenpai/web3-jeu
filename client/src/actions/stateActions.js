import * as states from '../Actions'

export function modifyAppState(stateApp){
    return { type: states.MODIFY_STATE, stateApp}
}

export function modifyRenderNC(stateApp, render){
    return {type: states.MODIFY_RENDER, stateApp, render}
}