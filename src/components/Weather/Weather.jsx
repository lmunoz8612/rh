import React from 'react';
import {
    Box,
    CircularProgress,
    Grid2 as Grid,
    styled,
    Typography
} from '@mui/material';
import { capitalizeString, getDateString } from '../../assets/utils/utils';
import api from '../../api/api';

const StylizedWeatherContainer = styled(Box)(({ theme }) => ({
    textAlign: 'center',
}));

const StylizedWheaterContainerItem = styled(Grid)(() => ({
    alignItems: 'center',
    display: 'inline-flex',
    height: '3vh',
    margin: 'auto',
    width: 'auto',
}));

const Weather = () => {
    const [temperature, setTemperature] = React.useState(null);
    const [temperatureDesc, setTemperatureDesc] = React.useState(null);
    const [weatherIcon, setWeatherIcon] = React.useState(null);
    const [errorMessage, setErrorMessage] = React.useState('');

    React.useEffect(() => {
        const fetchData = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    api.get(`temperature/?latitude=${latitude}&longitude=${longitude}`)
                        .then(({ data }) => {
                            setTemperature(data.main.temp);
                            setTemperatureDesc(data.weather[0].description);
                            setWeatherIcon(`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);
                        })
                        .catch(error => {
                            setErrorMessage(`Ha ocurrido un error al obtener la temperatura: ${error}`);
                            return;
                        });
                }, (error) => {
                    setErrorMessage(`Ha ocurrido un error al obtener la ciudad: ${error}`);
                    return;
                });
            }
            else {
                setErrorMessage('La geolocalización no es compatible con este navegador.');
                return;
            }
        };

        fetchData();
    }, []);

    return (
        <StylizedWeatherContainer>
            {temperature !== null ? (
                <Grid container>
                    <StylizedWheaterContainerItem size={12}>
                        <img src={weatherIcon} alt={'icon'} />
                        <Typography variant="h6" fontWeight="bold" color="primary">{temperature}°C</Typography>
                        <Typography component="span" variant="caption" color="primary" className="ml-1">{capitalizeString(temperatureDesc)}</Typography>
                    </StylizedWheaterContainerItem>
                    <Grid size={12}>
                        <Typography variant="body1" color="primary">{capitalizeString(getDateString())}</Typography>
                    </Grid>
                </Grid>
            ) : (!errorMessage ? <CircularProgress /> : errorMessage)}
        </StylizedWeatherContainer>
    );
}

export default Weather;