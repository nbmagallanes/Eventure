import { NavLink } from "react-router-dom";
import "./Event.css"

export default function Event({ data }) {

    const { id, name, description, startDate, previewImage, type } = data;

    // const dateConverter = (dateString) =>{
    //     const newDate = new Date(dateString)
    //     const date = dateString.split('T')[0]
    //     console.log('newDateeeee', newDate)
    //     console.log('original dateeeee', dateString)
    //     const time = newDate.toLocaleTimeString('en-US', {
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         hour12: true,
    //         timeZoneName: 'short'
    //     });
    //     console.log('hereeeeee', date, time)
    //     return [date, time]
    // }

    const dateConverter = (dateString) => {
        
        let date;
        let time;
        
        const tempDate = dateString.split(', ')[0].split('/')
        const tempTime = dateString.split(', ')[1]

        if (tempDate[0].length === 1 && tempDate[1].length === 1) date = `${tempDate[2]}-0${tempDate[0]}-0${tempDate[1]}`
        else if (tempDate[0].length === 1) date = `${tempDate[2]}-0${tempDate[0]}-${tempDate[1]}`
        else if (tempDate[1].length === 1) date = `${tempDate[2]}-${tempDate[0]}-0${tempDate[1]}`
        else date = `${tempDate[2]}-${tempDate[0]}-${tempDate[1]}`

        if (tempTime.length === 10) time = `0${tempTime.slice(0, 4)} ${tempTime.slice(-2)}`
        else if (tempTime.length === 11) time = `${tempTime.slice(0, 5)} ${tempTime.slice(-2)}`

        return [date, time]
    }

    return (
        <NavLink to={`/events/${id}`}>
            <div className="singular-event-container">
                <div className="event-feed-image-info-container">
                    <div>
                        <img src={previewImage} alt='Event Image'/>
                    </div>
                    <div className="events-feed-info-section">
                        <p className="events-feed-date">{`${dateConverter(startDate)[0]} • ${dateConverter(startDate)[1]}`}</p>
                        <h1>{name}</h1>
                        <h3 className="events-feed-event-type">{type === 'In person' ?  ( !data.Venue?.city && !data.Venue?.state ? 
                        `${data.Group?.city}, ${data.Group?.state}` : `${data.Venue?.city}, ${data.Venue?.state}`) 
                        : 'Online'}</h3>
                    </div>
                </div>
                <div className="events-feed-about-section">
                    <p>{description}</p>
                </div>
            </div>
        </NavLink>
    )
}