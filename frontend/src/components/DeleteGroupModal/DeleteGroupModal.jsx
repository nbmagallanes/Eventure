import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { deleteGroup } from '../../store/groupsReducer';
import './DeleteGroup.css'

export default function DeleteGroupModal({navigate}) {
    const group = useSelector(state => state.groupsState.group)
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const deleteCurrentGroup = async (e) => {
        e.preventDefault();
        closeModal();
        await dispatch(deleteGroup(group.id));
        navigate('/groups');
    };

    return (
        <div className='modal-container'>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this group?</p>
            <button className='yes button' onClick={(e) => deleteCurrentGroup(e)}> Yes (Delete Group)</button>
            <button className='no button' onClick={ () => closeModal() }>No (Kepp Going)</button>
        </div>
    )
}