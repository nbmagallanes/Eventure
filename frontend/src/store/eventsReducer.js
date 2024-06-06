import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/getEvents'
const LOAD_EVENT = 'events/loadEvent'

// Action Creators
export const getEvents = (events) => ({
    type: GET_EVENTS,
    events
});

export const loadEvent = (event) => ({
    type: LOAD_EVENT,
    event
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

// Reducer
const initialState = { events: {} }

const eventsReducer = (state=initialState, action) => {
    let newState = {};
    switch (action.type) {
        case GET_EVENTS:
            newState = {...state, events: action.events}
            // action.events.forEach( event => {newState.events[event.id] = event})
            console.log('New state', newState)
            return newState
        case LOAD_EVENT:
            return {...state, events: action.event}
        default:
            return state
    }

}

export default eventsReducer;