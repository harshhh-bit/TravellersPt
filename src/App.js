import * as React from 'react';

import { CssBaseline } from '@material-ui/core'

import Header from './components/Header/Header'
import Map, {Marker, Popup} from 'react-map-gl';
import TourIcon from '@mui/icons-material/Tour';

import "./app.css"

function App() {
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
        <Marker longitude={77} latitude={20} anchor="bottom" >
          <TourIcon style={{ color: "slateblue" }} />
        </Marker>
        <Popup 
          longitude={77} 
          latitude={20}
          anchor="left">
          <div className="card">
            <label>Title</label>
            <h3 className="title">J&K Diaries</h3>
            <label>Blog</label>
            <p className="blog">Beautiful Place. I like it.</p>
            <label>Information</label>
            <span className="username">Created by <b>harshit</b></span>
            <span className="userbio">Travel Enthusiast</span>
          </div>
        </Popup>
      </Map>
    </>
  );
}

export default App;
// 1. TourIcon size dynamics 2. Map style update
