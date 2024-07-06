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

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
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
      >
        {travels.map(travel => (
          <>
            <Marker longitude={travel.long} latitude={travel.lat} anchor="bottom" >
              <TourIcon 
                style={{ 
                  color: travel.username === currentUser ? "tomato" : "slateblue", 
                  cursor: "pointer" 
                }} 
                onClick={() => handleMarkerClick(travel._id)}
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
      </Map>
    </>
  );
}

export default App;

// 1. TourIcon size dynamics 2. Map style update
