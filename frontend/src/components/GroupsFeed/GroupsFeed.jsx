import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllGroups } from "../../store/groupsReducer";
import Group from "../Group/Group";
import "./GroupsFeed.css"

export default function GroupsFeed() {
    const dispatch = useDispatch();
    const groupsObj = useSelector( state => state.groupsState.groups)
    const groups = Object.values(groupsObj) // array with all the groups

    // console.log('groupsObj', groupsObj)
    console.log('groups', groups)
    
    useEffect(() => {
        dispatch(getAllGroups())
    }, [dispatch])
    
    if (!groups.length) return <div></div>

    return (
        <div className="group-feed-container">
            <div className="nav-links">
                <NavLink to='/events'>Events</NavLink>
                <NavLink>Groups</NavLink>
            </div>
            <div>
                <h4>Groups in Eventure</h4>
            </div>
            <div>
                { groups.map( group => (
                    <Group data={group} key={group.id}/>
                ))}
            </div>
        </div>
    )
}