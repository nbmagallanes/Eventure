import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllEvents } from "../../store/eventsReducer";
import Event from "../Event/Event";
import "./EventsFeed.css"

export default function EventsFeed() {
    const dispatch = useDispatch();
    const eventsObj = useSelector( state => state.eventsState.events)
    const events = Object.values(eventsObj)

    let upcomingEvents = []
    let pastEvents = []
    let orderedEvents = []
    let today = new Date()

    if (events.length) {
        events.forEach((event) => {
            if (new Date(event.startDate) < today) pastEvents.push(event)
            if (new Date(event.startDate) > today) upcomingEvents.push(event)
        })
    
        upcomingEvents.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        pastEvents.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        
        orderedEvents = [...upcomingEvents, ...pastEvents]
    }

    // if (!events.length) return <div></div>

    useEffect(() => {
        dispatch(getAllEvents())
    }, [dispatch])

    return (
        <div className="events-feed-container">
            <div className="nav-links">
                <NavLink>Events</NavLink>
                <NavLink to='/groups'>Groups</NavLink>
            </div>
            <div className="events-feed-title">
                <h4>Events in Eventure</h4>
            </div>
            <div className="events-list-container">
                { orderedEvents?.map( event => (
                    <Event data={event} key={event.id}/>
                ))}
            </div>
        </div>
    )
}