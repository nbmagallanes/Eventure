import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, NavLink } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import DeleteEventModal from '../DeleteEventModal';
import { getEvent } from '../../store/eventsReducer';
import { getGroup } from '../../store/groupsReducer';
import { LuClock5 } from "react-icons/lu";
import { AiOutlineDollar } from "react-icons/ai";
import { FaMapPin } from "react-icons/fa";
import "./EventDetails.css"

export default function EventDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const event = useSelector( state => state.eventsState.event);
    const group = useSelector( state => state.groupsState.group)
    const user = useSelector( state => state.session.user)
    const eventImage = event?.EventImages?.find((image) => image?.preview === true)
    const groupImage = group?.GroupImages?.findLast((image) =>  image.preview === true).url;
    const { eventId } = useParams();

    useEffect(() => {
        dispatch(getEvent(eventId))
    }, [dispatch, eventId])

    useEffect(() => {
        if (event?.Group?.id && !group.length) {
            dispatch(getGroup(event?.Group?.id));
        }
    }, [dispatch, event])

    if (!event.id) return <div></div>;
    if (!group.id) return <div></div>;

    // const dateConverter = (dateString) =>{
    //     const newDate = new Date(dateString)
    //     const date = dateString.split('T')[0]
    //     const time = newDate.toLocaleTimeString('en-US', {
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         hour12: true,
    //         timeZoneName: 'short'
    //     });
    //     return [date, time]
    // }

    // const dateConverter = (dateString) => {
    //     let date;
    //     let time;
        
    //     const tempDate = dateString.split(', ')[0].split('/')
    //     const tempTime = dateString.split(', ')[1]

    //     if (tempDate[0].length === 1 && tempDate[1].length === 1) date = `${tempDate[2]}-0${tempDate[0]}-0${tempDate[1]}`
    //     else if (tempDate[0].length === 1) date = `${tempDate[2]}-0${tempDate[0]}-${tempDate[1]}`
    //     else if (tempDate[1].length === 1) date = `${tempDate[2]}-${tempDate[0]}-0${tempDate[1]}`
    //     else date = `${tempDate[2]}-${tempDate[0]}-${tempDate[1]}`

    //     if (tempTime.length === 10) time = `0${tempTime.slice(0, 4)} ${tempTime.slice(-2)}`
    //     else if (tempTime.length === 11) time = `${tempTime.slice(0, 5)} ${tempTime.slice(-2)}`
        
    //     return [date, time]
    // }

    const dateConverter = (dateString) => {

        let newDate = dateString.replaceAll('/', '-').split(', ')
        let date = `${newDate[0].slice(6)}-${newDate[0].slice(0,2)}-${newDate[0].slice(3,5)}`
        let time = newDate[1]

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
                            <NavLink to={`/groups/${group?.id}`}>
                                <div className='event-details-group-info-container'>
                                    <div>
                                        <img src={groupImage}/>
                                    </div>
                                    <div className='event-group-name-type-container'>
                                        <h4>{group?.name}</h4>
                                        <p>{group?.private ? "Private" : "Public"}</p>
                                    </div>
                                </div>
                            </NavLink>
                            <div className='event-info-container'>
                                <div className='event-details-date-display-container'>
                                    <span>
                                        <LuClock5 size={25}/>
                                    </span>
                                    <div className='event-details-date-display-content-container'>
                                        <div className='event-details-date-display-content start'>
                                            <p>START</p>
                                            <p className='specific-date'>{dateConverter(event.startDate)[0]}</p>
                                            <p className='specific-date'>&#8226;</p>
                                            <p className='specific-date'>{dateConverter(event.startDate)[1]}</p>
                                        </div>
                                        <div className='event-details-date-display-content end'>
                                            <p>END</p>
                                            <p className='specific-date'>{dateConverter(event.endDate)[0]}</p>
                                            <p className='specific-date'>&#8226;</p>
                                            <p className='specific-date'>{dateConverter(event.endDate)[1]}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='event-detail-price-container'>
                                    <span><AiOutlineDollar size={25}/></span>
                                    {console.log('wooooooo', event.price)}
                                    <p>{event.price === 0.00 ? "FREE" : `$${event.price}`}</p>
                                </div>
                                <div className='event-details-type-buttons-container'>
                                    <div className='event-details-type-container'>
                                        <span><FaMapPin size={25}/></span>
                                        <p>{event.type}</p>     
                                    </div>
                                    {user && user.id === group?.Organizer?.id ? (
                                        <div>
                                            <button onClick={() => (alert("Feature coming soon."))}>Update</button>
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