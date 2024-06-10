import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { editGroup } from '../../store/groupsReducer';
import { getGroup } from '../../store/groupsReducer';
import { addGroupImage } from '../../store/imagesReducer';
import '../CreateGroupForm/CreateGroupForm.css'

export default function UpdateGroupForm() {
    const group = useSelector(state => state.groupsState.group)
    const user = useSelector(state => state.session.user)
    const groupImage = group?.GroupImages?.find((image) =>  image.preview === true);
    const url = groupImage.url

    const [location, setLocation] = useState(group.city ? `${group.city}, ${group.state}` : '');
    const [name, setName] = useState(group.name ? group.name : '');
    const [about, setAbout] = useState(group.about ? group.about : '');
    const [type, setType] = useState(group.type ? group?.type : '');
    const [isPrivate, setIsPrivate] = useState( (group.private === true ||
                                                group.private === false)? 
                                                group.private : '');
    const[submitted, setSubmitted] = useState(false)
    const [validationErrors, setValidationErrors] = useState({});
    const [imageUrl, setImageUrl] = useState(url ? url : '');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groupId } = useParams()

    useEffect(() => {
        if (!group.id) {
            dispatch(getGroup(groupId)).then( (group) => {
                setLocation(`${group.city}, ${group.state}`);
                setName(group.name);
                setAbout(group.about);
                setType(group.type);
                setIsPrivate(group.private)
                setImageUrl()
            });
        }
    }, [dispatch, group, groupId])

    useEffect(() => {
        if (imageUrl) dispatch(addGroupImage({imageUrl: url, resGroup: group}))
    }, [imageUrl])

    useEffect(() => {
        // console.log('third use effect ran')
        const errors = {};
        if (!location.length) errors.location = "Location is required"
        if (!name.length) errors.name = "Name is required"
        else if (name.length > 60) errors.name = "Name must be 60 character or less"
        if (!about.length || about.length < 50) errors.about = "Desciption must be at least 50 characters long"
        if (!type) errors.type = "Group Type is required"
        if ((isPrivate !== false && isPrivate !== 'false') && (isPrivate !== true && isPrivate !== 'true')) {
            errors.isPrivate = "Visibility Type is required"
        }
        // console.log("this is the url", imageUrl, imageUrl && imageUrl.slice(-5) !== '.jpeg' && imageUrl.slice(-4) !== '.jpg' && imageUrl.slice(-4) !== '.png')
        if (imageUrl && imageUrl.slice(-5) !== '.jpeg' && imageUrl.slice(-4) !== '.jpg' && imageUrl.slice(-4) !== '.png') errors.imageUrl = "Image URL must end in .png, .jpg, or .jpeg"
        setValidationErrors(errors)
    }, [location, name, about, type, isPrivate])


    useEffect (() => {
        if ((user?.id && group?.id && user?.id !== group.Organizer?.id) || !user?.id) navigate('/');
    }, [group, user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (Object.values(validationErrors).length) return;

        const editedGroup = {
            name,
            about,
            type,
            private: isPrivate === 'true' ? true : false,
            city: location.split(', ')[0],
            state: location.split(', ')[1]
        }

        const response = await dispatch(editGroup({editedGroup, groupId}))

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
                <h1>UPDATE YOUR GROUP&apos;S INFORMATION</h1>
                <h2>We&apos;ll walk you through a few steps to update your group&apos;s information</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='group-form-location-container group-form-sub-section'>
                    <div className='group-form-sub-one'>
                        <h2>First, set your group&apos;s location</h2>
                        <p>
                            Eventure groups meet locally, in person and online. We&apos;ll connect you 
                            with people in your area, and more can join you online.
                        </p>
                    </div>
                    <input id='location' 
                        type='text' 
                        value={location} 
                        onChange={(e) => {setLocation(e.target.value)}} 
                        placeholder='city, STATE'
                    />
                    <div style={{color:'red'}}>{submitted && validationErrors.location}</div>
                </div>
                <div className='group-form-name-container group-form-sub-section'>
                    <div className='group-form-sub-one'>
                        <h2>What is the name of your group?</h2>
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
                        <h2>Now describe what your group will be about</h2>
                        <p>People will see this when we promote your group.</p>
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
                        placeholder='Please write at least 30 characters'
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
                        <p>Please add in image url for your group below:</p>
                        <input id='image' 
                        type='url' 
                        value={imageUrl} 
                        onChange={(e) => {setImageUrl(e.target.value)}} 
                        placeholder='Image url'
                    />
                        <div style={{color:'red'}}>{submitted && validationErrors.imageUrl}</div>
                    </div>
                </div>
                <div className='group-form-create-button'>
                    <button>Update Group</button>
                </div>
            </form>
        </div>
    )

}