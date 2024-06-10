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
    const groupImage = group?.GroupImages?.find((image) =>  image.preview === true).url;
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
        <>
            <div className='event-details-top-page-container'>
                <div className='event-list-name-organizer'>
                    <div className='event-details-top-link'>
                        <p>&lt;</p>
                        <Link to='/events'>Events</Link>
                    </div>
                    <h2>{event.name}</h2>
                    <p>{`Hosted by ${group?.Organizer?.firstName} ${group?.Organizer?.lastName}`}</p>
                </div>
            </div>
            <div className='event-details-bottom-page-container'>
                <div className='event-details-bottom-page-content'>
                    <div className='event-details-image-info-container'>
                        <div className='event-details-image-container'>
                            <img src={eventImage?.url} alt='Event Image'/>
                        </div>
                        <div className='event-details-general-info-container'>
                            <div className='event-details-group-info-container'>
                                <div>
                                    <img src={groupImage}/>
                                </div>
                                <div className='event-group-name-type-container'>
                                    <h4>{group?.name}</h4>
                                    <p>{group?.private ? "Private" : "Public"}</p>
                                </div>
                            </div>
                            <div className='event-info-container'>
                                <div className='event-details-date-display-container'>
                                    <div className='event-details-date-display-content'>
                                        <p>START</p>
                                        <p className='specific-date'>{dateConverter(event.startDate)[0]}</p>
                                        <p className='specific-date'>&#8226;</p>
                                        <p className='specific-date'>{dateConverter(event.startDate)[1]}</p>
                                    </div>
                                    <div className='event-details-date-display-content'>
                                        <p>END</p>
                                        <p className='specific-date'>{dateConverter(event.endDate)[0]}</p>
                                        <p className='specific-date'>&#8226;</p>
                                        <p className='specific-date'>{dateConverter(event.endDate)[1]}</p>
                                    </div>
                                </div>
                                <div>
                                    <p>{event.price === 0 ? "FREE" : `$${event.price}`}</p>
                                </div>
                                <div className='event-details-type-buttons-container'>
                                    <div>
                                        <p>{event.type}</p>     
                                    </div>
                                    {user && user.id === group?.Organizer?.id ? (
                                        <div>
                                            <button>Update</button>
                                            <OpenModalButton
                                                buttonText='Delete'
                                                modalComponent={<DeleteEventModal  className='delete-modal-button' navigate={navigate}/>}
                                                className='delete-event-open-button'
                                            />
                                        </div>
                                    ) : ( null )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='event-details-description-container'>
                        <h3>Details</h3>
                        <p>{event.description}</p>
                    </div>
                </div>
            </div>

        </>
    )
}