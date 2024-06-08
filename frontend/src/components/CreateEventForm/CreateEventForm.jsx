import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createNewEvent } from '../../store/eventsReducer';
import { getGroup } from '../../store/groupsReducer';

export default function CreateEventForm() {
    let group = useSelector(state => state.groupsState.group)

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [venue, setVenue] = useState('');
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");
    const [isPrivate, setIsPrivate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const[submitted, setSubmitted] = useState(false)
    const [validationErrors, setValidationErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { groupId } = useParams();

    useEffect(() => {
        dispatch(getGroup(groupId))
    }, [groupId])

    useEffect(() => {
        const errors = {};
        if (!name.length) errors.name = "Name is required"
        else if (name.length < 5) errors.name = "Name must be at least 5 characters"
        if (!price) errors.price = "Price is required"
        if (!capacity) errors.capacity = "Capacity is required"
        if (!startDate.length) errors.startDate = "Event start is required"
        if (!endDate.length) errors.endDate = "Event end is required"
        if (!type) errors.type = "Event Type is required"
        if (!isPrivate) errors.isPrivate = "Visibility is required"
        if (imageUrl.slice(-5) !== '.jpeg' && imageUrl.slice(-4) !== '.jpg' && imageUrl.slice(-4) !== '.png') errors.imageUrl = "Image URL must end in .png, .jpg, or .jpeg"
        if (!description || description.length < 30) errors.description = "Description must be at least 30 characters long"
        setValidationErrors(errors)
    }, [name, description, type, endDate, startDate, price, capacity, isPrivate, imageUrl])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (Object.values(validationErrors).length) return;

        const newEvent = {
            venueId: parseInt(venue),
            name,
            type,
            capacity,
            price,
            description,
            startDate,
            endDate,
            imageUrl
        }

        const response = await dispatch(createNewEvent({newEvent, groupId}))

        if (response) {
            setName("")
            setType("")
            setCapacity("")
            setPrice()
            setStartDate("")
            setEndDate("")
            setDescription("")
            setImageUrl("")

            navigate(`/events/${response.id}`)
        }

    }

    return (
        <div className='form-container'>
            <div className='title-container'>
                <h4>{`Create an event for ${group.name}`}</h4>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='name-container sub-section'>
                    <p>What is the name of your event?</p>
                    <input id='name' 
                        type='text' 
                        value={name} 
                        onChange={(e) => {setName(e.target.value)}} 
                        placeholder='Event Name'
                    />
                    <div style={{color:'red'}}>{submitted && validationErrors.name}</div>
                </div>
                <div className='type-container sub-section'>
                    <p>Is this an in-person or online event?</p>
                    <select name='type' value={type} onChange={(e) => {setType(e.target.value)}} >
                            <option value='' disabled>(select one)</option>
                            <option value='In person'>In person</option>
                            <option value='Online'>Online</option>
                    </select>
                    <div style={{color:'red'}}>{submitted && validationErrors.type}</div>
                </div>
                { type === 'In person' ? (
                    <div className='venue-container sub-section'>
                        <p>Select the venue:</p>
                        <select name='venue' value={venue} onChange={(e) => {setVenue(e.target.value)}}>
                            <option value='' disabled>(select one)</option>
                            {group?.Venues.map( (venue) => (
                                <option key={venue.id} value={venue.id}>{`${venue.address}`}</option>
                            ))}
                        </select>
                        <div style={{color:'red'}}>{submitted && validationErrors.type}</div>
                    </div>
                ) : ( null )}
                <div className='private-container sub-section'>
                    <p>Is this event private or public?</p>
                    <select name='type' value={isPrivate} onChange={(e) => {setIsPrivate(e.target.value)}}>
                            <option value='' disabled>(select one)</option>
                            <option value='Private'>Private</option>
                            <option value='Public'>Public</option>
                    </select>
                    <div style={{color:'red'}}>{submitted && validationErrors.isPrivate}</div>
                </div>
                <div className='capacity-container sub-section'>
                    <p>What is the capacity for this event?</p>
                    <input id='capacity' 
                        type='text' 
                        value={capacity} 
                        onChange={(e) => {setCapacity(e.target.value)}} 
                        placeholder='0'
                    />
                    <div style={{color:'red'}}>{submitted && validationErrors.capacity}</div>
                </div>
                <div className='price-container sub-section'>
                    <p>What is the price for your event?</p>
                    <input id='price' 
                        type='text' 
                        value={price} 
                        onChange={(e) => {setPrice(e.target.value)}} 
                        placeholder='0'
                    />
                    <div style={{color:'red'}}>{submitted && validationErrors.price}</div>
                </div>
                <div className='event-data-container sub-section'>
                    <div>
                        <p>When does your event start?</p>
                        <input id='start-date' 
                            type='text' 
                            value={startDate} 
                            onChange={(e) => {setStartDate(e.target.value)}} 
                            placeholder='MM/DD/YY HH:mm AM'
                        />
                        <div style={{color:'red'}}>{submitted && validationErrors.startDate}</div>
                    </div>
                    <div>
                        <p>When does your event end?</p>
                        <input id='end-date' 
                            type='text' 
                            value={endDate} 
                            onChange={(e) => {setEndDate(e.target.value)}} 
                            placeholder='MM/DD/YY HH:mm PM'
                        />
                        <div style={{color:'red'}}>{submitted && validationErrors.endDate}</div>
                    </div>
                    <div>
                        <p>Please add an image url for your event below:</p>
                        <input id='image' 
                            type='text' 
                            value={imageUrl}
                            onChange={(e) => {setImageUrl(e.target.value)}} 
                            placeholder='Image URL'
                        />
                        <div style={{color:'red'}}>{submitted && validationErrors.imageUrl}</div>
                    </div>
                    <div>
                        <p>Please describe your event</p>
                        <input id='description' 
                            type='text' 
                            value={description}
                            onChange={(e) => {setDescription(e.target.value)}} 
                            placeholder='Please include at least 30 characters'
                        />
                        <div style={{color:'red'}}>{submitted && validationErrors.description}</div>
                    </div>
                </div>
                <div>
                    <button>Create Event</button>
                </div>
            </form>
        </div>
    )
}