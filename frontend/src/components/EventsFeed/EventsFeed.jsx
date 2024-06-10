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

    useEffect(() => {
        dispatch(getAllEvents())
    }, [dispatch])

    if (!events.length) return <div></div>

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
                { events?.map( event => (
                    <Event data={event} key={event.id}/>
                ))}
            </div>
        </div>
    )
}