import React from "react";

import TourIcon from '@mui/icons-material/Tour';
import CancelIcon from '@mui/icons-material/Cancel';
import "./login.css"
import axios from "axios";

export default function Login({setShowLogin , myStorage , setCurrentUser}) {
  const [failure, setFailure] = React.useState(false);
  const nameRef = React.useRef();
  const passwordRef = React.useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value
    };

    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);            
      setFailure(false);
    } catch (err) {
      setFailure(true);
    }
  }

  return (
    <div className="login-container">
      <div className="logo">
        <TourIcon />
        <span>TravellersPt</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus type="text" placeholder="username" ref={nameRef} required /> 
        <input type="password" placeholder="password" min="6" ref={passwordRef} required/>
        <button className="login-btn" type="submit">
          Login
        </button>
        {failure && (
          <span className="failure">Something went wrong!</span>
        )}
      </form>
      <CancelIcon 
        className="login-cancel" 
        onClick={() => setShowLogin(false)}
      />
    </div>
  )
}