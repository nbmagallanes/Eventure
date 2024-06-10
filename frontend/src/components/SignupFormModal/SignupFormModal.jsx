import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const validateEmail = (email) => {
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.')
    if (atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length -1) return true;
    return false;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {}

    if (!validateEmail(email)) {
      newErrors.email = "The provided email is invalid"
    }

    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            newErrors = {...data?.errors, ...newErrors}
            setErrors(newErrors)
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  const notVisible = !email || !firstName || !lastName || 
                            username.length < 4 || password.length < 6;


  return (
    <div className='signup-form-container'>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {errors.email && <p className='signup-error-message'>{errors.email}</p>}
        {errors.username && <p className='signup-error-message'>{errors.username}</p>}
        {errors.firstName && <p className='signup-error-message'>{errors.firstName}</p>}
        {errors.lastName && <p className='signup-error-message'>{errors.lastName}</p>}
        {errors.password && <p className='signup-error-message'>{errors.password}</p>}
        {errors.confirmPassword && <p className='signup-error-message'>{errors.confirmPassword}</p>}
      <div className='signup-form-grouped-container'>
        <div className='signup-form-label-container'>
          <label>
            First Name
          </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
        </div>
        <div className='signup-form-label-container'>
          <label>
            Last Name
          </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
        </div>
      </div>
      <div className='signup-form-grouped-container'>
        <div className='signup-form-label-container'>
          <label>
            Email
          </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
        </div>
        <div className='signup-form-label-container'>
          <label>
            Username
          </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
        </div>
      </div>
      <div className='signup-form-grouped-container'>
        <div className='signup-form-label-container'>
          <label>
            Password
          </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
        </div>
        <div className='signup-form-label-container'>
          <label>
            Confirm Password
          </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
        </div>
      </div>
        <button className='signup-form-button' type="submit" disabled={notVisible}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;
