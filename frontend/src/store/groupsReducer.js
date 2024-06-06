import { csrfFetch } from "./csrf";

// import { csrfFetch } from './csrf.js';
const GET_GROUPS = 'groups/getGroups'
const LOAD_GROUP = 'groups/loadGroup'
const CREATE_GROUP = 'groups/createGroup'

// Action Creators
export const getGroups = (groups) => ({
    type: GET_GROUPS,
    groups
});

export const loadGroup = (group) => ({
    type: LOAD_GROUP,
    group
});

export const createGroup = (group) => ({
    type: CREATE_GROUP,
    group
});

// Thunks
export const getAllGroups = () => async (dispatch) => {
    const response = await csrfFetch("/api/groups")

    if (response.ok) {
        const data = await response.json()
        console.log('response', data)
        dispatch(getGroups(data.Groups))
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

export const createNewGroup = (group) => async (dispatch) => {
    const response = await csrfFetch("/api/groups", {
        method: 'POST',
        body: JSON.stringify(group)
    })

    console.log("create New Group response", response)

    if (response.ok) {
        const resGroup = await response.json()
        console.log('CG response', resGroup)
        dispatch(createGroup(resGroup))
        return resGroup
    } else {
        const error = await response.json()
        console.log("CG Error", error)
        return error
    }
};


// Reducer
const initialState = { groups: {}, group: {} }

const groupsReducer = (state=initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_GROUPS:
            newState = {...state, groups: {}}
            action.groups.forEach( group => {newState.groups[group.id] = group})
            // console.log('New state', newState)
            // return newState
            // newState = { ...state, groups: action.groups }
            console.log('New state', newState)
            return newState
        case LOAD_GROUP:
            // newState = { ...state, group: {}}
            // newState.group = action.group
            // console.log('New group state', newState)
            return {...state, group: action.group}
        case CREATE_GROUP:
            // newState = {...state}
            // newState.groups[action.group.id] = action.group
            newState = {...state, groups: {...state.groups, [action.group.id]: action.group}}
            console.log("CREATE GROUP", newState)
            return newState
        default:
            return state
    }

}

export default groupsReducer;