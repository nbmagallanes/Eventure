import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../store/eventsReducer";
import { useEffect } from "react";
import "./Group.css"

export default function Group({data}) {

    const { previewImage, id, name, city, state, about } = data;
    const dispatch = useDispatch();
    const eventsObj = useSelector( state => state.eventsState.events)
    const events = Object.values(eventsObj)
    // console.log(events)

    useEffect(() => {
        dispatch(getAllEvents())
    },[])

    return (
        <NavLink to={`/groups/${id}`}>
            <div className="group-container">
                <div>
                    <img src={previewImage} alt='Group Image'/>
                </div>
                <div className="group-feed-info-container">
                    <div className="info-section">
                        <h1>{name}</h1>
                        <h3>{`${city}, ${state}`}</h3>
                        <p>{about}</p>
                    </div>
                    <div className="group-feed-event-private-section">
                        <p className="event-private-element">{(events.filter((singleEvent) => singleEvent.Group.id === id)).length} events</p>
                        <p className="event-private-element">&#8226;</p>
                        <p className="event-private-element">{data?.private === false ? "Public" : "Private"}</p>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}