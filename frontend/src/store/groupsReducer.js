import { csrfFetch } from "./csrf";

// import { csrfFetch } from './csrf.js';
const GET_GROUPS = 'groups/getGroups'
const LOAD_GROUP = 'groups/loadGroup'

// Action Creators
export const getGroups = (groups) => ({
    type: GET_GROUPS,
    groups
});

export const loadGroup = (group) => ({
    type: LOAD_GROUP,
    group
});

// Thunks
export const getAllGroups = () => async (dispatch) => {
    const response = await csrfFetch("/api/groups")

    if (response.ok) {
        const { Groups } = await response.json()
        console.log('response', Groups)
        dispatch(getGroups(Groups))
    } else {
        const error = await response.json()
        console.log("Error", error)
    }
};

export const getGroup = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`)

    if (response.ok) {
        const payload = await response.json()
        console.log('response', payload)
        dispatch(loadGroup(payload))
    } else {
        const error = await response.json()
        console.log("Error", error)
    }
};



// Reducer
const initialState = { groups: {} }

const groupsReducer = (state=initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_GROUPS:
            newState = {...state, groups: {}}
            action.groups.forEach( group => {newState.groups[group.id] = group})
            console.log('New state', newState)
            return newState
        case LOAD_GROUP:
            // newState = { ...state, group: {}}
            // newState.group = action.group
            // console.log('New group state', newState)
            return {...state, groups: action.group}
        default:
            return state
    }

}

export default groupsReducer;