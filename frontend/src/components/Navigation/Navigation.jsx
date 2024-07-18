import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import './Navigation.css';
import { useState } from 'react';

function Navigation({ isLoaded }) {
  const [arrow, setArrow] = useState(false)
  const sessionUser = useSelector(state => state.session.user);

  const onClick = () => {
    setArrow(prevArrow => !prevArrow)
  }

  const sessionLinks = sessionUser ?
    (
      // <li>
      <div className='logged-in-navbar'>
        <NavLink to='groups/new' className='new-group-link'>Start a new group</NavLink>
        <div className='profile-button'>
          <ProfileButton user={sessionUser} onClick={onClick}/>
        </div>
        <p>{arrow ? <IoIosArrowUp /> :  <IoIosArrowDown /> }</p>
      </div>
      // </li>
    ) : (
      <div className='buttons'>
        {/* <li> */}
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
            className='modal-button'
          />
          {/* <NavLink to="/login">Log In</NavLink> */}
        {/* </li> */}
        {/* <li> */}
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
            className='modal-button'
          />
          {/* <NavLink to="/signup">Sign Up</NavLink> */}
        {/* </li> */}
      </div>
    );

  return (
    // <ul>
    <div className='nav-bar'>
      {/* <li> */}
        <NavLink to="/" className='logo'>Eventure</NavLink>
      {/* </li> */}
        {isLoaded && sessionLinks}
    </div>
    // </ul>
  );
}

export default Navigation;
