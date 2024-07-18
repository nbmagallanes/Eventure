import { useEffect, useState } from 'react';
import { useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createNewGroup } from '../../store/groupsReducer';
import './CreateGroupForm.css'

export default function CreateGroupForm () {
    const [location, setLocation] = useState("");
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [type, setType] = useState("");
    const [isPrivate, setIsPrivate] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const[submitted, setSubmitted] = useState(false)
    const [validationErrors, setValidationErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const errors = {};
        if (!location.length) errors.location = "Location is required"
        if (!name.length) errors.name = "Name is required"
        else if (name.length > 60) errors.name = "Name must be 60 character or less"
        if (!about.length || about.length < 50) errors.about = "Desciption must be at least 50 characters long"
        if (!type) errors.type = "Group Type is required"
        if (!isPrivate) errors.isPrivate = "Visibility Type is required"
        if (!imageUrl || (imageUrl && (imageUrl.slice(-5) !== '.jpeg' && imageUrl.slice(-4) !== '.jpg' && imageUrl.slice(-4) !== '.png'))) errors.imageUrl = "Image URL must end in .png, .jpg, or .jpeg"
        
        setValidationErrors(errors)
        
    }, [location, name, about, type, isPrivate, imageUrl])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (Object.values(validationErrors).length) return;

        const newGroup = {
            name,
            about,
            type,
            isPrivate: isPrivate === 'true' ? true : false,
            city: location.split(', ')[0],
            state: location.split(', ')[1],
            imageUrl
        }

        const response = await dispatch(createNewGroup(newGroup))
        // console.log('this is the response form the create group form', response)

        if (response) {
            setLocation("")
            setName("")
            setAbout("")
            setType("")
            setIsPrivate("")
            setImageUrl("")
            navigate(`/groups/${response.id}`)
        }
    }

    return (
        <div className='group-form-container'>
            <div className='group-form-title-container'>
                <h1>START A NEW GROUP</h1>
                <h2>We&apos;ll walk you through a few steps to build your local community</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='group-form-location-container group-form-sub-section'>
                    <div className='group-form-sub-one'> 
                        <h2>First, set your group&apos;s location.</h2>
                        <p>
                            Eventure groups meet locally, in person and online. We&apos;ll connect you 
                            with people in your area, and more can join you online.
                        </p>
                    </div>
                    <input id='location' 
                        type='text' 
                        value={location} 
                        onChange={(e) => {setLocation(e.target.value)}} 
                        placeholder='City, STATE'
                    />
                    <div style={{color:'red'}}>{submitted && validationErrors.location}</div>
                </div>
                <div className='group-form-name-container group-form-sub-section'>
                    <div className='group-form-sub-one'>
                        <h2>What will your group&apos;s name be?</h2>
                        <p>Choose a name that will give people a clear idea of what the group is about.</p>
                        <p>Feel free to get creative! You can edit this later if you change your mind.</p>
                    </div>
                    <input id='name' 
                        type='text' 
                        value={name} 
                        onChange={(e) => {setName(e.target.value)}} 
                        placeholder='What is your group name?'
                    />
                    <div style={{color:'red'}}>{submitted && validationErrors.name}</div>
                </div>
                <div className='group-form-about-container group-form-sub-section'>
                    <div className='group-form-sub-one'>
                        <h2>Describe the purpose of your group</h2>
                        <p>People will see this when we promote your group, but you&apos;ll be able to add to it later, too.</p>
                    </div>
                    <ol>
                        <li>What&apos;s the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <textarea id='about' 
                        type='text'
                        value={about} 
                        className='group-form-about-container-input'
                        onChange={(e) => {setAbout(e.target.value)}} 
                        placeholder='Please write at least 50 characters'
                    />
                    <div style={{color:'red'}}>{submitted && validationErrors.about}</div>
                </div>
                <div className='group-form-final-steps-container group-form-sub-section'>
                    <h2>Final steps...</h2>
                    <div>
                        <p>Is this an in person or online group?</p>
                        <select name='type' value={type} onChange={(e) => {setType(e.target.value)}} >
                            <option value='' disabled>(select one)</option>
                            <option value='In person'>In person</option>
                            <option value='Online'>Online</option>
                        </select>
                        <div style={{color:'red'}}>{submitted && validationErrors.type}</div>
                    </div>
                    <div>
                        <p>Is this group private or public?</p>
                        <select name='isPrivate' value={isPrivate} onChange={(e) => {setIsPrivate(e.target.value)}} >
                            <option value='' disabled>(select one)</option>
                            <option value={true}>Private</option>
                            <option value={false}>Public</option>
                        </select>
                        <div style={{color:'red'}}>{submitted && validationErrors.isPrivate}</div>
                    </div>
                    <div>
                        <p>Please add an image URL for your group below:</p>
                        <input id='image' 
                        type='url' 
                        value={imageUrl} 
                        onChange={(e) => {setImageUrl(e.target.value)}} 
                        placeholder='Image Url'
                    />
                        <div style={{color:'red'}}>{submitted && validationErrors.imageUrl}</div>
                    </div>
                </div>
                <div className='group-form-create-button'>
                    <button>Create Group</button>
                </div>
            </form>
        </div>
    )
}