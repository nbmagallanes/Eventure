import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getGroup } from '../../store/groupsReducer';
import './GroupDetails.css'
import OpenModalButton from '../OpenModalButton';
import DeleteGroupModal from '../DeleteGroupModal/DeleteGroupModal';

export default function GroupDetails() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const group = useSelector( state => state.groupsState.group)
    const user = useSelector(state => state.session.user);
    const { groupId } = useParams()

    // console.log('ID', groupId)
    // console.log('group', group.id)
    useEffect(() => {
        console.log('useEffect running');
        dispatch(getGroup(groupId));
    }, [dispatch, groupId]);

    if (!group.id) return <div></div>

    return (
        <div className='page-container'>
            <div className='top-page-container'>
                <div className='link-image'>
                    <Link to='/groups'>Groups</Link>
                    <p>placeholder for img</p>
                </div>
                <div className='group-info-container'>
                    <h1>{group.name}</h1>
                    <p>{`${group.city}, ${group.state}`}</p>
                    <div className='event-private-container'>
                        <p># Events</p>
                        <p>*</p>
                        <p>{group.private === false ? "Public" : "Private"}</p>
                    </div>
                    <p>{`Organized by ${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</p>
                    {user && user.id === group.Organizer?.id ? (
                        <div>
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
                            <button>Join this group</button>
                        </div>
                    )}
                </div>
            </div>
            <div className='bottom-page-container'>
                <div className='about-container'>
                    <h2>Organizer</h2>
                    <h4>{`${group.Organizer?.firstName} ${group.Organizer?.lastName}`}</h4>
                    <h2>What we&apos;re about</h2>
                    <p>{group.about}</p>
                </div>
                <div className='events-container'>
                    <h3>Upcoming Events</h3>
                    <p>Place holder for Upcoming Events</p>
                    <h3>Past Events</h3>
                    <p>Place holder for Past Events</p>
                </div>
            </div>
        </div>
    
    )
}