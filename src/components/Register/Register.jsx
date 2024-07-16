import React from "react";

import TourIcon from '@mui/icons-material/Tour';
import CancelIcon from '@mui/icons-material/Cancel';
import "./register.css"
import axios from "axios";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = React.useState(false);
  const [failure, setFailure] = React.useState(false);
  const nameRef = React.useRef();
  const emailRef = React.useRef();
  const passwordRef = React.useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value
    };

    try {
      await axios.post("/users/register", newUser);
      setFailure(false);
      setSuccess(true);
    } catch (err) {
      setFailure(true);
    }
  }

  return (
    <div className="register-container">
      <div className="logo">
          <TourIcon />
          <span>TravellersPt</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus type="text" placeholder="username" ref={nameRef} required /> 
        <input type="email" placeholder="email" ref={emailRef} required />
        <input type="password" placeholder="password" min="6" ref={passwordRef} required />
        <button className="register-btn" type="submit">
          Register
        </button>
        {success && (
          <span className="success">Successful. You can login now!</span>
        )}
        {failure && (
          <span className="failure">Something went wrong!</span>
        )}
      </form>
      <CancelIcon 
        className="register-cancel" 
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}