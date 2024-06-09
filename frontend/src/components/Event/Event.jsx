import { NavLink } from "react-router-dom";
import "./Event.css"

export default function Event({ data }) {

    const { id, name, description, startDate, previewImage, type } = data;

    return (
        <NavLink to={`/events/${id}`}>
            <div className="event-container">
                <div className="image-info-container">
                    <div>
                        <img src={previewImage} alt='Event Image'/>
                    </div>
                    <div className="info-section">
                        <p className="date">{startDate}</p>
                        <h2>{name}</h2>
                        <p className="event-type">{type === 'In person' ?  `${data.Venue.city}, ${data.Venue.state}` : 'Online'}</p>
                    </div>
                </div>
                <div className="about-section">
                    <p>{description}</p>
                </div>
            </div>
        </NavLink>
    )
}