import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, NavLink } from 'react-router-dom';
import { getGroup } from '../../store/groupsReducer';
import './GroupDetails.css'
import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from '../DeleteGroupModal/DeleteGroupModal';
import { getAllGroupEvents } from '../../store/eventsReducer';
// import Event from '../Event/Event';

export default function GroupDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const group = useSelector( state => state.groupsState.group)
    console.log("groupppppppppp", group)
    const user = useSelector(state => state.session.user);
    const eventsObj = useSelector(state => state.eventsState.events)
    const events = Object.values(eventsObj);
    const { groupId } = useParams();
    const groupImage = group?.GroupImages?.find((image) =>  image.preview === true).url;
    console.log("group image!", groupImage)
    console.log("eventsssss", events)

    let upcomingEvents = []
    let pastEvents = []
    let today = new Date()

    events.forEach((event) => {
        if (new Date(event.startDate) < today) pastEvents.push(event)
        if (new Date(event.startDate) > today) upcomingEvents.push(event)
    })

    upcomingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    pastEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    useEffect(() => {
        dispatch(getGroup(groupId));
        dispatch(getAllGroupEvents(groupId))
    }, [groupId]);

    if (!group.id || group.id !== +groupId) return <div></div>

    return (
        <>
            <div className='page-container'>
                <div className='top-page-container'>
                    <div className='group-details-link'>
                        <p>&lt;</p>
                        <Link to='/groups'>{`Groups`}</Link> 
                    </div>
                    <div className='details-group-info-container'>
                        <div className='group-image-info-content'>
                            <div className='group-details-image'>
                                <img src={groupImage} alt='Group Image'/>
                            </div>
                            <div className='group-details-info-section'>
                                <div className='group-details-info-content'>
                                    <div className='group-details-title-section'>
                                        <h1>{group.name}</h1>   
                                    </div>
                                    <div className='group-details-small-section'>
                                        <p>{`${group.city}, ${group.state}`}</p>
                                        <div className='event-private-container'>
                                            <p>{events.length} events</p>
                                            <p>&#8226;</p>
                                            <p>{group.private === false ? "Public" : "Private"}</p>
                                        </div>
                                        <p>{`Organized by ${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</p>
                                    </div>
                                </div>
                                { !user ? (
                                null
                                ) : (
                                    user && user.id === group.Organizer?.id ? (
                                        <div className='edit-group-container'>
                                            <button onClick={() => navigate('events/new')}>Create event</button>
                                            <button onClick={() => navigate('edit')}>Update</button>
                                            <OpenModalButton
                                                buttonText='Delete'
                                                modalComponent={<DeleteGroupModal  className='delete-modal-button' navigate={navigate}/>}
                                                className='open-modal-button'
                                                />
                                        </div>
                                    ) : (
                                        <div> 
                                            <button onClick={() => (alert("Feature coming soon."))}>Join this group</button>
                                        </div>
                                    )
                                    
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bottom-page-container'>
                <div className='bottom-page-content'>
                    <div className='general-about-container'>
                        <div className='organizer-container'>
                            <h2>Organizer</h2>
                            <p>{`${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</p>
                        </div>
                        <div className='about-container'>
                            <h2>What we&apos;re about</h2>
                            <p>{group.about}</p>
                        </div>
                    </div>
                    <div className='event-feed-container'>
                        <div className='group-details-events-feed-container'>
                            {upcomingEvents.length ? (
                                <div className='upcoming-container'>
                                    <h2>Upcoming Events ({upcomingEvents.length})</h2>
                                    {upcomingEvents.map (event => (
                                        // <Event data={event} key={event.id}/>
                                        <NavLink to={`/events/${event.id}`} key={event.id}>
                                            <div className="group-details-event-container">
                                                <div className="group-details-event-image-info-container">
                                                    <div className='event-group-image-div'>
                                                        <img className='event-group-image' src={event.previewImage} alt='Event Image'/>
                                                    </div>
                                                    <div className="group-events-info-section">
                                                        <p className="group-details-event-date">{event.startDate}</p>
                                                        <h2>{event.name}</h2>
                                                        <p className="group-details-event-type">{event.type === 'In person' ?  `${event.Venue.city}, ${event.Venue.state}` : 'Online'}</p>
                                                    </div>
                                                </div>
                                                <div className="group-details-event-about-section">
                                                    <p>{event.description}</p>
                                                </div>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>

                            ): null}
                            {pastEvents.length ? (
                                <div>
                                    <h2>Past Events ({pastEvents.length})</h2>
                                    {pastEvents.map (event => (
                                        // <Event data={event} key={event.id}/>
                                        <NavLink to={`/events/${event.id}`} key={event.id}>
                                            <div className="group-details-event-container">
                                                <div className="group-details-event-image-info-container">
                                                    <div className='event-group-image-div'>
                                                        <img className='event-group-image' src={event.previewImage} alt='Event Image'/>
                                                    </div>
                                                    <div className="group-events-info-section">
                                                        <p className="group-details-event-date">{event.startDate}</p>
                                                        <h2>{event.name}</h2>
                                                        <p className="group-details-event-type">{event.type === 'In person' ?  `${event.Venue.city}, ${event.Venue.state}` : 'Online'}</p>
                                                    </div>
                                                </div>
                                                <div className="group-details-event-about-section">
                                                    <p>{event.description}</p>
                                                </div>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>

                            ): null}
                            {(!upcomingEvents.length && !pastEvents.length) ? <h3>No Upcoming Events</h3> : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    
    )
}