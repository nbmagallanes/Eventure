import { csrfFetch } from "./csrf";
import { addGroupImage } from "./imagesReducer";

// import { csrfFetch } from './csrf.js';
const GET_GROUPS = 'groups/getGroups'
const LOAD_GROUP = 'groups/loadGroup'
const CREATE_GROUP = 'groups/createGroup'
const UPDATE_GROUP = 'groups/updateGroup'
const DELETE_GROUP = 'groups/deleteGroup'

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

export const updateGroup = (group) => ({
    type: UPDATE_GROUP,
    group
});

export const removeGroup = (group) => ({
    type: DELETE_GROUP,
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
        return payload
    } else {
        const error = await response.json()
        console.log("Error", error)
    }
};

export const createNewGroup = (group) => async (dispatch) => {

    console.log('this is the group passed in from create new group', group)
    
    const { name, about, type, isPrivate, city, state, imageUrl } = group;

    const response = await csrfFetch("/api/groups", {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            about: about,
            type: type,
            private: isPrivate,
            city: city,
            state: state
        })
    })

    if (response.ok) {
        const resGroup = await response.json()
        // console.log('CG response', resGroup)
        await dispatch(addGroupImage({imageUrl, resGroup}))
        await dispatch(createGroup(resGroup))
        return resGroup
    } else {
        const error = await response.json()
        // console.log("CG Error", error)
        return error
    }
};

export const editGroup = ({editedGroup, groupId}) => async (dispatch) => {

    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        body: JSON.stringify(editedGroup)
    })

    console.log("edit Group response", response)

    if (response.ok) {
        const resGroup = await response.json()
        console.log('UG response', resGroup)
        dispatch(updateGroup(resGroup))
        return resGroup
    } else {
        const error = await response.json()
        console.log("UG Error", error)
        return error
    }

};

export const deleteGroup = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE',
    })

    console.log("delete Group response", response)

    if (response.ok) {
        // const resGroup = await response.json()
        // console.log('UG response', resGroup)
        dispatch(removeGroup(groupId))
    } else {
        const error = await response.json()
        console.log("UG Error", error)
        return error
    }
    
}


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
        case LOAD_GROUP: {
            const loadedGroup = action.group;
            newState = {...state, group: loadedGroup}
            return newState
        }
        case CREATE_GROUP: {
            const newGroup = action.group;
            newState = {...state, groups: {...state.groups, [newGroup.id]: newGroup}}
            console.log("CREATE GROUP", newState)
            return newState 
        }
        case UPDATE_GROUP: {
            const updatedGroup = action.group;
            newState = {...state, groups: {...state.groups, [updatedGroup.id]: updatedGroup}}
            console.log("UPDATE GROUP", newState)
            return newState
        }
        case DELETE_GROUP: {
            newState = {...state}
            delete newState[action.group.id]
            return newState
        }
        default:
            return state
    }

}

export default groupsReducer;