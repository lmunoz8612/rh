import React from 'react';
import {
    Avatar,
    Box,
    Grid2 as Grid,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import logo from '../assets/imgs/logo.jpg';

const WorkAnniversary = ({ title, usersData, isMediumScreen, ...rest }) => {
    const theme = useTheme();
    return (
        <>
            {title && <><Typography component="div" variant="body1" color="primary" fontWeight="bold">{title}</Typography><hr /></>}
            <Box
                sx={{
                    textAlign: 'center',
                    backgroundColor: theme.palette.primary.main,
                    margin: 0,
                    padding: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    ...rest
                }}>
                <h1 style={{ color: theme.palette.common.white, fontSize: isMediumScreen ? theme.typography.fontSize : theme.typography.fontSize * 3, fontWeight: 'bold' }}>
                    ¡Feliz Aniversario Laboral en RH!
                </h1>
                <Box
                    sx={{
                        background: theme.palette.common.white,
                        padding: 2,
                        borderRadius: 2,
                        mb: 2,
                        maxWidth: '70%',
                        color: theme.palette.primary.main,
                        position: 'relative',
                        width: '100%',
                    }}>
                    <Box p={1}>
                        <Grid container>
                            {usersData.map((userData, index) => (
                                <Grid key={index} size={isMediumScreen ? 12 : (usersData.length > 4 ? 4 : 12 / usersData.length)}>
                                    <Stack key={index} direction="column" alignItems="center" mb={2}>
                                        <Avatar src={userData.file} sx={{ height: isMediumScreen ? '70px' : '100px', width: isMediumScreen ? '70px' : '100px', ml: 1, }} />
                                        <Typography variant="body1" color="primary" fontWeight="bold" className="ml-1">
                                            {userData.user_full_name}
                                        </Typography>
                                        <Typography variant="body2" color="primary" className="ml-1">
                                            {userData.job_position}
                                            <br />
                                            {userData.job_position_office_short}
                                            <br />
                                            {userData.years_worked}° Aniversario
                                        </Typography>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                    <Typography variant={isMediumScreen ? 'body2' : 'h6'} color="primary" fontWeight="bold">
                        Hoy celebramos su dedicación, esfuerzo y compromiso con la empresa.
                        Estamos muy agradecidos con todo lo aportado y por ser parte fundamental
                        de este equipo. ¡Que sigan los éxitos en esta carrera laboral!
                    </Typography>
                    <Typography variant={isMediumScreen ? 'body2' : 'h5'} color="primary" fontWeight="bold" mt={2}>Atentamente.</Typography>
                    <img
                        src={logo}
                        alt="RH"
                        style={{ marginTop: theme.shape.margin * 2, width: isMediumScreen ? '100%' : '50%', }}
                    />
                </Box>
            </Box>
        </>
    )
};

export default WorkAnniversary;