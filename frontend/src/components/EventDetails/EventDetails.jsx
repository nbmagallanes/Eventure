import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import "./EventDetails.css"
import { getEvent } from '../../store/eventsReducer';
import { getGroup } from '../../store/groupsReducer';

export default function EventDetails() {
    const dispatch = useDispatch();
    const event = useSelector( state => state.eventsState.event);
    const group = useSelector( state => state.groupsState.group)
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
                    <div>
                        <div>
                            <p>START {dateConverter(event.startDate)[0]}</p>
                            <p>{dateConverter(event.startDate)[1]}</p>
                        </div>
                        <div>
                            <p>END {dateConverter(event.endDate)[0]}</p>
                            <p>{dateConverter(event.endDate)[1]}</p>
                        </div>
                        <p>{event.price === 0 ? "Free" : `$${event.price}`}</p>
                        <p>{event.type}</p>
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