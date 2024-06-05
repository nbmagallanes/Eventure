import { csrfFetch } from "./csrf";

// import { csrfFetch } from './csrf.js';
const GET_GROUPS = 'groups/getGroups'

// Action Creators
export const getGroups = (groups) => ({
    type: GET_GROUPS,
    groups
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
}

// Reducer
const initialState = { groups: {} }

const groupsReducer = (state=initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_GROUPS:
            newState = {...state, groups: {}}
            action.groups.forEach( group => (newState.groups[group.id] = group))
            console.log('New state', newState)
            return newState
        default:
            return state
    }

}

export default groupsReducer;