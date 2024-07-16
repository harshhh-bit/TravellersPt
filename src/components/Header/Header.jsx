import React from 'react';

import { Autocomplete } from '@react-google-maps/api';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';

import useStyles from './styles.js';

const Header = ({ setViewState }) => {
    const classes = useStyles();
    
    const [autocomplete, setAutocomplete] = React.useState(null);

    const onLoad = (autoC) => setAutocomplete(autoC);
    
    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location) {
              const lat = place.geometry.location.lat();
              const lng = place.geometry.location.lng();
              
              setViewState(prevViewState => ({
                ...prevViewState,
                latitude: lat,
                longitude: lng,
                zoom: 12.5
              }
            ));
        }
    }}

    return (
        <AppBar position="static">
            <Toolbar className={classes.toolbar}>
                <Typography variant="h5" className={classes.title}>
                    TravellersPt
                </Typography>
                <Box display="flex">
                    <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <div className={classes.search}>
                            <InputBase placeholder="Search Place" classes={{ root: classes.inputRoot, input: classes.inputInput }} />
                        </div>
                    </Autocomplete>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;