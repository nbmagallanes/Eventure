import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getGroup } from '../../store/groupsReducer';
import './GroupDetails.css'
import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from '../DeleteGroupModal/DeleteGroupModal';
import { getAllGroupEvents } from '../../store/eventsReducer';
import Event from '../Event/Event';

export default function GroupDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const group = useSelector( state => state.groupsState.group)
    const user = useSelector(state => state.session.user);
    const eventsObj = useSelector(state => state.eventsState.events)
    const events = Object.values(eventsObj);
    const { groupId } = useParams();
    const groupImage = group?.GroupImages?.find((image) =>  image.preview === true).url;
    console.log("group image!", groupImage)

    let upcomingEvents = []
    let pastEvents = []
    let today = new Date()

    events.forEach((event) => {
        if (new Date(event.startDate) < today) pastEvents.push(event)
        if (new Date(event.startDate) > today) upcomingEvents.push(event)
    })

    upcomingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    pastEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

    console.log('events!!', events)
    console.log('past events!!', pastEvents)
    console.log('upcoming events!!', upcomingEvents)

    useEffect(() => {
        console.log('useEffect running');
        dispatch(getGroup(groupId));
        dispatch(getAllGroupEvents(groupId))
    }, [dispatch, groupId]);

    if (!group.id || group.id !== +groupId) return <div></div>

    return (
        <>
            <div className='page-container'>
                <div className='top-page-container'>
                    <div className='link-image'>
                        <div className='link'>
                            <p>{`<`}</p>
                           <Link to='/groups'>{`Groups`}</Link> 
                        </div>
                        <img src={groupImage} alt='Group Image'/>
                    </div>
                    <div className='group-info-container'>
                        <div className='group-info-content'>
                            <h1>{group.name}</h1>
                            <p>{`${group.city}, ${group.state}`}</p>
                            <div className='event-private-container'>
                                <p>{events.length} events</p>
                                <p>&#8226;</p>
                                <p>{group.private === false ? "Public" : "Private"}</p>
                            </div>
                            <p>{`Organized by ${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</p>
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
                        <div className='events-container'>
                            {upcomingEvents.length ? (
                                <div className='upcoming-container'>
                                    <h2>Upcoming Events ({upcomingEvents.length})</h2>
                                    {upcomingEvents.map (event => (
                                        <Event data={event} key={event.id}/>
                                    ))}
                                </div>

                            ): null}
                            {pastEvents.length ? (
                                <div>
                                    <h2>Past Events ({pastEvents.length})</h2>
                                    {pastEvents.map (event => (
                                        <Event data={event} key={event.id}/>
                                    ))}
                                </div>

                            ): null}
                            {(!upcomingEvents.length && !pastEvents.length) ? <h3>Events (0)</h3> : null}
                        </div>
                    </div>
                </div>
            </div>
        </>
    
    )
}