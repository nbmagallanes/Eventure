import { NavLink } from "react-router-dom";
import "./Group.css"

export default function Group({data}) {

    const { /*previewImage,*/ id, name, city, state, about } = data;

    return (
        <NavLink to={`/groups/${id}`}>
            <div className="group-container">
                <div>
                    <span>Placeholder for Image</span>
                </div>
                <div>
                    <h2>{name}</h2>
                    <h3>{`${city}, ${state}`}</h3>
                    <p>{about}</p>
                    <div className="event-private-info">
                        <p># Events</p>
                        <p>*</p>
                        <p>{data?.private === false ? "Public" : "Private"}</p>
                    </div>
                </div>
            </div>
        </NavLink>
    )
}