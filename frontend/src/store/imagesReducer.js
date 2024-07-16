import { csrfFetch } from "./csrf";

const POST_EVENT_IMAGE = 'images/postEventImage';
const POST_GROUP_IMAGE = 'images/postGroupImage';

export const postImage = (image) => ({
    type: POST_EVENT_IMAGE,
    image
});

export const postGroupImage = (image) => ({
    type: POST_GROUP_IMAGE,
    image
});

export const addEventImage = ({ imageUrl, resEvent }) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${resEvent.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url: imageUrl,
            preview: true
        })
    })
    console.log('addimage response', response)

    if (response.ok) {
        const image = await response.json()
        dispatch(postImage(image))
        return image
    } else {
        const error = await response.json()
        return error
    }
}

export const addGroupImage = ({ imageUrl, resGroup }) => async (dispatch) => {
    console.log("this is the thunk group received", resGroup, imageUrl)
    const response = await csrfFetch(`/api/groups/${resGroup.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url: imageUrl,
            preview: true
        })
    })
    console.log('addimage response', response)

    if (response.ok) {
        const image = await response.json()
        dispatch(postGroupImage(image))
        return image
    } else {
        const error = await response.json()
        return error
    }
}

const initialState = { groupImages: {}, eventImages: {} }

const imagesReducer = (state=initialState, action) =>  {
    let newState = {};
    switch (action.type) {
        case POST_EVENT_IMAGE: {
            const newImage = action.image;
            newState = {...state, eventImages: { ...state.eventImages, [newImage.id]: newImage}}
            return newState
        }
        case POST_GROUP_IMAGE: {
            const newImage = action.image;
            newState = {...state, groupImages: { ...state.groupImages, [newImage.id]: newImage}}
            return newState
        }
        default:
            return state
    }
}

export default imagesReducer;