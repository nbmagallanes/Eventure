import { csrfFetch } from "./csrf";
import { addEventImage } from "./imagesReducer";

const GET_EVENTS = 'events/getEvents'
const LOAD_EVENT = 'events/loadEvent'
const CREATE_EVENT = 'events/createEvent'
const DELETE_EVENT = 'events/deleteEvent'
const GET_GROUP_EVENT = 'events/getGroupEvent'

// Action Creators
export const getEvents = (events) => ({
    type: GET_EVENTS,
    events
});

export const loadEvent = (event) => ({
    type: LOAD_EVENT,
    event
});

export const createEvent = (event) => ({
    type: CREATE_EVENT,
    event
});

export const removeEvent = (event) => ({
    type: DELETE_EVENT,
    event
});

export const getGroupEvents = (events) => ({
    type: GET_GROUP_EVENT,
    events
});


// Thunks
export const getAllEvents = () => async (dispatch) => {
    const response = await csrfFetch("/api/events")

    if (response.ok) {
        const { Events } = await response.json()
        console.log('response', Events)
        dispatch(getEvents(Events))
    } else {
        const error = await response.json()
        console.log("Error", error)
    }
};

export const getEvent = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`)

    if (response.ok) {
        const payload = await response.json()
        console.log('response', payload)
        dispatch(loadEvent(payload))
    } else {
        const error = await response.json()
        console.log("Error", error)
    }
};

export const createNewEvent = ({newEvent, groupId}) => async (dispatch) => {
    const { venueId, name, type, capacity, price, description, startDate, endDate, imageUrl } = newEvent
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'POST',
        body: JSON.stringify({
            venueId,
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate,
        })
    })

    console.log("create New event response", response)

    if (response.ok) {
        const resEvent = await response.json()
        // console.log('CG response', resGroup)
        await dispatch(addEventImage({imageUrl, resEvent}))
        await dispatch(createEvent(resEvent))
        return resEvent
    } else {
        const error = await response.json()
        // console.log("CG Error", error)
        return error
    }
};

export const deleteEvent = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE',
    })

    console.log("delete Event response", response)

    if (response.ok) {
        // const resGroup = await response.json()
        // console.log('UG response', resGroup)
        dispatch(removeEvent(eventId))
    } else {
        const error = await response.json()
        console.log("DE Error", error)
        return error
    }
};

export const getAllGroupEvents = (groupId) => async (dispatch) => {
    const response = await csrfFetch(`/api/groups/${groupId}/events`, {
        method: 'GET'
    })

    if (response.ok) {
        const {Events} = await response.json()
        console.log('this is the response for get events by group id', Events)
        dispatch(getGroupEvents(Events))
    } else {
        const error = await response.json()
        return error
    }
};

// Reducer
const initialState = { events: {}, event: {} }

const eventsReducer = (state=initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_EVENTS:
            newState = {...state, events: {} }
            action.events.forEach( event => { newState.events[event.id] = event })
            // newState = {...state, events: action.events} // original that was working
            console.log('New state', newState)
            return newState
        case LOAD_EVENT:
            return {...state, event: action.event}
        case CREATE_EVENT:{
            const newEvent = action.event;
            newState = {...state, events: {...state.events, [newEvent.id]: newEvent}}
            console.log('CREAT EVENT', newState)
            return newState
        }
        case DELETE_EVENT: {
            newState = {...state}
            delete newState[action.event.id]
            return newState
        }
        case GET_GROUP_EVENT: {
            newState = {...state, events: {} }
            action.events.forEach( event => { newState.events[event.id] = event })
            console.log("new new", newState)
            return newState
        }
        default:
            return state
    }

}

export default eventsReducer;