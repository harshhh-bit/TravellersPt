import * as React from 'react';

import { CssBaseline } from '@material-ui/core'
import Header from './components/Header/Header'
import Map, { Marker, Popup } from 'react-map-gl';
import TourIcon from '@mui/icons-material/Tour';
import { format } from "timeago.js"

import "./app.css"

import axios from "axios";


function App() {
  const currentUser = "harshit";
  const [travels, setTravels] = React.useState([]);
  const [currentPlaceId, setCurrentPlaceId] = React.useState(null);
  const [newPlace, setNewPlace] = React.useState(null);
  const [title, setTitle] = React.useState(null);
  const [blog, setBlog] = React.useState(null);

  React.useEffect(() => {
    const getTravels = async () => {
      try {
        const res= await axios.get("/travels");
        setTravels(res.data);
      } catch(err) {
        console.log(err);
      }
    };
    getTravels();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    // need change
  };

  const handleDblClick = (event) => {
    const [lat, long] = event.lngLat;
    setNewPlace({
      lat,
      long
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTravel = {
      username: currentUser,
      title,
      blog,
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

  return (
    <>
      <CssBaseline />
      <Header />
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        initialViewState={{
          longitude: +77.12,
          latitude: +28.38,
          zoom: 4
        }}
        style={{width: "100vw", height: "91.5vh"}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleDblClick}
        // transitionDuration="200"
      >
        {travels.map(travel => (
          <>
            <Marker longitude={travel.long} latitude={travel.lat} anchor="bottom" >
              <TourIcon 
                style={{ 
                  color: travel.username === currentUser ? "tomato" : "slateblue", 
                  cursor: "pointer" 
                }} 
                onClick={() => handleMarkerClick(travel._id, travel.lat, travel.long)}
              />
            </Marker>
            {travel._id === currentPlaceId && (
              <Popup
                longitude={travel.long} 
                latitude={travel.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}>
                <div className="card">
                  <label>Title</label>
                  <h3 className="title">{travel.title}</h3>
                  <label>Blog</label>
                  <p className="blog">{travel.blog}</p>
                  <label>Information</label>
                  <span className="username">Created by <b>{travel.username}</b></span>
                  <span className="userbio">Travel Enthusiast</span>
                  <span className="date">{format(travel.createdAt)}</span>  
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup 
            longitude={newPlace.long} 
            latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input 
                  placeholder="Enter a title" 
                  onChange={(e) => setTitle(e.target.value)} 
                />
                <label>Blog</label>
                <textarea 
                  placeholder="Share your experience..." 
                  onChange={(e) => setBlog(e.target.value)}
                />
                <button type="submit" className="submit-btn">
                  Add Travel
                </button>
              </form>
            </div>  
          </Popup>
        )}
      </Map>
    </>
  );
}

export default App;

// 1. TourIcon size dynamics 2. Map style update
// 3. Marker offset update 1:25:00
// 4. rating