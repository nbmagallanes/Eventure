import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import DeleteEventModal from '../DeleteEventModal';
import { getEvent } from '../../store/eventsReducer';
import { getGroup } from '../../store/groupsReducer';
import "./EventDetails.css"

export default function EventDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const event = useSelector( state => state.eventsState.event);
    const group = useSelector( state => state.groupsState.group)
    const user = useSelector( state => state.session.user)
    const eventImage = event?.EventImages?.find((image) => image?.preview === true)
    const { eventId } = useParams();

    useEffect(() => {
        dispatch(getEvent(eventId))
    }, [dispatch, eventId])

    useEffect(() => {
        if (event?.Group?.id && !group.length) {
            console.log("dispatchinggggg")
            dispatch(getGroup(event?.Group?.id));
        }
    }, [dispatch, event])

    if (!event.id) return <div></div>;
    if (!group.id) return <div></div>;

    const dateConverter = (dateString) =>{
        const newDate = new Date(dateString)
        const date = dateString.split('T')[0]
        const time = newDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZoneName: 'short'
        });
        return [date, time]
    }

    if (!event.id || event.id !== +eventId) return <div></div>

    return (
        <div>
            <div>
                <Link to='/events'>Events</Link>
                <h2>{event.name}</h2>
                <p>{`Hosted by ${group?.Organizer?.firstName} ${group?.Organizer?.lastName}`}</p>
            </div>
            <div>
                <div>
                    <p>Image Place Holder</p>
                </div>
                <div>
                    <div>
                        <div>
                            <img src={eventImage?.url} alt='Event Image'/>
                        </div>
                        <div>
                            <p>{group?.name}</p>
                            <p>{group?.private ? "Private" : "Public"}</p>
                        </div>
                    </div>
                    <div className='event-info-container'>
                        <div>
                            <p>START {dateConverter(event.startDate)[0]}</p>
                            <p>{dateConverter(event.startDate)[1]}</p>
                        </div>
                        <div>
                            <p>END {dateConverter(event.endDate)[0]}</p>
                            <p>{dateConverter(event.endDate)[1]}</p>
                        </div>
                        <p>{event.price === 0 ? "Free" : `$${event.price}`}</p>
                        <div>
                            <p>{event.type}</p>
                            {user && user.id === group?.Organizer?.id ? (
                                <OpenModalButton
                                    buttonText='Delete'
                                    modalComponent={<DeleteEventModal  className='delete-modal-button' navigate={navigate}/>}
                                    className='delete-event-open-button'
                                />
                            ) : ( null )}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3>Details</h3>
                <p>{event.description}</p>
            </div>

        </div>
    )
}