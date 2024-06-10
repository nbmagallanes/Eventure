import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteEvent } from '../../store/eventsReducer';
import './DeleteEvent.css'

export default function DeleteEventModal({navigate}) {
    const event = useSelector(state => state.eventsState.event)
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const deleteCurrentEvent = async (e) => {
        e.preventDefault();
        closeModal();
        await dispatch(deleteEvent(event.id));
        navigate('/events');
    };

    return (
        <div className='delete-modal-container'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this event?</p>
            <button className='yes button' onClick={(e) => deleteCurrentEvent(e)}> Yes (Delete Event)</button>
            <button className='no button' onClick={ () => closeModal() }>No (Keep Event)</button>
        </div>
    )
}