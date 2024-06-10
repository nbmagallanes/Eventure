import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message === "Invalid credentials") {
          setErrors(data.message);
        }
      });
  };

  const handleClick = async () => {
    setCredential('Demo-lition')
    setPassword('password')
  }
  
  return (
    <div className='login-form-container'>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className='login-form-label-container'>
          {errors.length && <p>The provided credentials were invalid.</p>}
          <label>
            Username or Email
          </label>  
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
        </div>
        <div className='login-form-label-container'>
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
        <div className='login-form-label-container'>
          <button 
            className='login-form-button'
            type="submit" 
            disabled={credential.length >= 4 && password.length >= 6 ? false : true}
          >
            Log In
          </button>
        </div>
        <div className='login-form-label-container'>
          <button className='login-demo-user' onClick={() => handleClick()}>Log in as Demo User</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
