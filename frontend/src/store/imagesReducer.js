import { csrfFetch } from "./csrf";

const POST_EVENT_IMAGE = 'images/postEventImage';

export const postImage = (image) => ({
    type: POST_EVENT_IMAGE,
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

const initialState = { images: {}}

const imageReducer = (state=initialState, action) =>  {
    let newState = {};
    switch (action.type) {
        case POST_EVENT_IMAGE: {
            const newImage = action.image;
            newState = {...state, images: { ...state.images, [newImage.id]: newImage}}
            return newState
        }
        default:
            return state
    }
}

export default imageReducer;