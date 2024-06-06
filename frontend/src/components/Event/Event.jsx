import { NavLink } from "react-router-dom";
import "./Event.css"

export default function Event({ data }) {

    const { id, name, description, startDate, /*previewImage,*/ type } = data;

    return (
        <NavLink to={`/events/${id}`}>
            <div className="event-container">
                <div>
                    <div>
                        <span>Placeholder for Image</span>
                    </div>
                    <div>
                        <p>{startDate}</p>
                        <h2>{name}</h2>
                        <p>{type === 'In person' ?  `${data.Venue.city}, ${data.Venue.state}` : 'Online'}</p>
                    </div>
                </div>
                <div>
                    <p>{description}</p>
                </div>
            </div>
        </NavLink>
    )
}