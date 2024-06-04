import { NavLink } from "react-router-dom";


export default function Landing() {
    return (
        <>
            <div>
                <h1>Title</h1>
                <h2>Intro Text</h2>
                <p>Info Graphic placeholder</p>
            </div>
            <div>
                <h3>How Eventure Works</h3>
                <p>Description caption</p>
            </div>
            <div>
                <div>
                    <p>Groups Icon Placeholder</p>
                    <NavLink to='/groups'>See all groups</NavLink>
                    <p>Groups caption</p>
                </div>
                <div>
                    <p>Event Icon Placeholder</p>
                    <NavLink to='/events'>Find an event</NavLink>
                    <p>Event caption</p>
                </div>
                <div>
                    <p>Start a Group Icon Placeholder</p>
                    <h4>Start a new group</h4>
                    <p>Start a group caption</p>
                </div>
            </div>
            <div>
                <button>Join Eventure</button>
            </div>
        </>
    )
}