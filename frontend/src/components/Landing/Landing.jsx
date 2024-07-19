import { NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import './Landing.css'
// import treesLogo from '../../../../images/trees.png';
import groupLogo from '../../../../images/teamwork.png';
import eventLogo from '../../../../images/eventLogo.png'
import allGroupLogo from '../../../../images/group.png'
import landscape from '../../../../images/landscape.png'
// import { FcConferenceCall } from "react-icons/fc";
// import { FcPlanner } from "react-icons/fc";
// import { FcMindMap } from "react-icons/fc";

export default function Landing() {
    const user = useSelector( state => state.session.user)
    
    return (
        <div className="landing-container">
            <div className="section-one-container">
                <div className="section-one-element title-text">
                    <h1>The people platform — Where interests become friendships</h1>
                    <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
                </div>
                <div className="section-one-element image-container">
                    <img src={landscape} alt='Logo with trees' />
                </div>
            </div>
            <div className="section-two-container">
                <h3>How Eventure Works</h3>
                <p>Join a group or attend an event to start meeting new friends. It&apos;s as simple as that!</p>
            </div>
            <div className="section-three-container">
                <div className="section-three-element">
                    {/* <FcMindMap className="landing-icons"/> */}
                    <img src={allGroupLogo} alt='event logo' />
                    <NavLink className='link'to='/groups'>See all groups</NavLink>
                    <p>Everyone belongs in Eventure! Browse through our many groups, join any that you are interested in.</p>
                </div>
                <div className="section-three-element">
                    <img src={eventLogo} alt='event logo' />
                    {/* <FcPlanner className="landing-icons resize"/> */}
                    <NavLink className='link' to='/events'>Find an event</NavLink>
                    <p>Find local or online events happening soon. Attend an event and make new memories with friends!</p>
                </div>
                <div className="section-three-element">
                    {/* <FcConferenceCall className="landing-icons new-group"/> */}
                    <img src={groupLogo} alt='teamwork logo' />
                    <NavLink className={user ? 'link' : 'disabled-link'} to='/groups/new'>Start a new group</NavLink>
                    <p>Would like to create a new group? Follow the link above to get started and become a group organizer!</p>
                </div>
            </div>
            {user ? null : (
                <div className="section-four-container">
                    <button className="join-button">Join Eventure</button>
                </div>
            )}
        </div>
    )
}