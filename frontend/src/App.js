import * as React from 'react';

import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Header/Header'
import Map, { Marker, Popup } from 'react-map-gl';
import TourIcon from '@mui/icons-material/Tour';
import StarIcon from '@mui/icons-material/Star';
import { format } from "timeago.js";

import Register from "./components/Register/Register";
import Login from "./components/Login/Login"
import "./app.css";

import axios from "axios";

function App() {
  const myStorage = window.localStorage;
  const [viewState, setViewState] = React.useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 5 
  });
  const [currentUser, setCurrentUser] = React.useState(myStorage.getItem("user"));
  const [travels, setTravels] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [blog, setBlog] = React.useState(null);
  const [star, setStar] = React.useState(0);
  const [pic, setPic] = React.useState(null);
  const [showBlogs, setShowBlogs] = React.useState(false);
  const [showRegister, setShowRegister] = React.useState(false);
  const [showLogin, setShowLogin] = React.useState(false);
  
  React.useEffect(() => {
    const getTravels = async () => {
      try {
        const allTravels = await axios.get("/travels");
        setTravels(allTravels.data);
      } catch(error) {
        console.log(error);
      }
    };
    getTravels();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({ ...viewState, latitude: lat, longitude: long });
  };

  const handleDblClick = (e) => {
    const {lat,lng} = e.lngLat;
    
    setNewPlace({
      lat: lat,
      long: lng
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onloadend = () => { setPic(reader.result); };

    if(file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTravel = {
      username: currentUser,
      title,
      blog,
      rating: star,
      pic,
      lat: newPlace.lat,
      long: newPlace.long
    }

    try {
      const res = await axios.post("/travels", newTravel);
      setTravels([...travels, res.data]);
      setNewPlace(null);
    } catch(err) {
      console.log(err);
    }
  }

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  }

  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header setViewState={setViewState} />
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        { ...viewState }
        onMove={e => setViewState(e.viewState)} 
        mapStyle="mapbox://styles/mapbox/streets-v9"
        style={{width: "100vw", height: "91vh"}}
        onDblClick={ currentUser && handleDblClick}
        transitionDuration="200"
      >
        {travels && travels.map(travel => (
          (travel.username === currentUser || showBlogs) &&
          <>
            <Marker 
              longitude={travel.long} 
              latitude={travel.lat} 
              anchor="bottom"
              offsetLeft={-3.5 * viewState.zoom}
              offsetTop={-7 * viewState.zoom}
            >
              <TourIcon 
                style={{
                  fontSize: 7 * viewState.zoom,
                  color: travel.username === currentUser ? "tomato" : "slateblue", 
                  cursor: "pointer" 
                }} 
                onClick={() => handleMarkerClick(travel._id, travel.lat, travel.long)}
              />
            </Marker>
            {travel._id === currentPlaceId && (
              <Popup
                key={travel._id}
                longitude={travel.long} 
                latitude={travel.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <img src={travel.pic} alt="Travel Pic" className="travel-pic"/>
                  <label>Title</label>
                  <h4 className="title">{travel.title}</h4>
                  <label>Blog</label>
                  <p className="blog">{travel.blog}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(travel.rating).fill(<StarIcon className="star"/>)}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{travel.username}</b>
                  </span>
                  <span className="date">{format(travel.createdAt)}</span>  
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <>
            <Marker 
              longitude={newPlace.long} 
              latitude={newPlace.lat} 
              anchor="bottom"
              offsetLeft={-3.5 * viewState.zoom}
              offsetTop={-7 * viewState.zoom}
            >
              <TourIcon 
                style={{
                  fontSize: 7 * viewState.zoom,
                  color: "tomato", 
                  cursor: "pointer"
                }} 
              />
            </Marker>
            <Popup 
              longitude={newPlace.long} 
              latitude={newPlace.lat}
              anchor="left"
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
            >
              <div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <label>Title</label>
                  <input 
                    placeholder="Enter a Title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                  />
                  <label>Blog</label>
                  <textarea 
                    placeholder="Share your Experience..." 
                    onChange={(e) => setBlog(e.target.value)}
                    required
                  />
                  <label>Rating</label>
                  <select onChange={(e) => setStar(e.target.value)}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <label>Pic</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    required
                  />
                  
                  <button type="submit" className="submit-btn">
                    Add Travel
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
        </Map>
        <button 
          className="button toggle-blogs"
          style={{ backgroundColor: showBlogs ? "red" : "green" }}
          onClick={ () => setShowBlogs(prevShowBlogs => !prevShowBlogs) }
        >
          {showBlogs ? "Hide" : "Show"} Blogs
        </button>
        {currentUser ? (
          <button 
            className="button logout"
            onClick={handleLogout}
          >
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button 
              className="button login" 
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button 
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && 
          <Register 
            setShowRegister={setShowRegister} 
          />
        }
        {showLogin && (
          <Login 
            setShowLogin={setShowLogin} 
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
    </ThemeProvider>
  );
}

export default App;
