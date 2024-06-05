import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllGroups } from "../../store/groupsReducer";

export default function GroupsFeed() {
    const dispatch = useDispatch();
    const groupsObj = useSelector( state => state.groupsState.groups)
    const groups = Object.values(groupsObj) // array with all the groups

    console.log('groupsObj', groupsObj)
    console.log('groups', groups)

    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch])

    return (
        <>
            <div>
                <NavLink>Events</NavLink>
                <NavLink>Groups</NavLink>
            </div>
            <div>
                <h3>Groups in Eventure</h3>
            </div>
            <div>
                { groups.map( group => (
                    <div key={group.id}>
                        <h3>{group.name}</h3>
                        <p>{group.about}</p>
                        <p>{group.type}</p>
                    </div>
                ))}
                {/* <p>hi</p> */}
            </div>
        </>
    )
}