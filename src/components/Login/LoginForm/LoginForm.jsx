import React from 'react';
import {
    Button,
    Box,
    Container,
    FormControlLabel,
    Checkbox,
    InputAdornment,
    Typography,
    styled,
} from '@mui/material';
import { Link } from 'react-router';
import FormField from '../../Forms/FormField/FormField.jsx';
import logo from '../../../assets/imgs/logo.jpg';

const StylizedIcon = styled('i')(({ theme }) => ({
    fontSize: '1.25rem',
    color: theme.palette.primary.main,
}));

const classes = {
    container: {
        alignItems: 'center',
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 3,
    },
    logo: {
        borderRadius: '8px 8px 0 0',
        marginBottom: 32,
        width: '100%',
    },
    form: {
        textAlign: 'left',
        width: '100%',
    },
    submitBtnContainer: {
        marginTop: 2,
        textAlign: 'center',
    },
};

const LoginForm = (props) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [rememberMe, setRememberMe] = React.useState(false);

    return (
        <Container maxWidth="xs">
            <Box sx={classes.container} className="pd-3">
                <img src={logo} alt="logo" style={classes.logo} />
                <form onSubmit={(e) => props.onSubmit(e, { username, password, rememberMe })} style={classes.form}>
                    <FormField
                        label="Usuario"
                        variant="outlined"
                        size="small"
                        fullWidth
                        required
                        className="mb-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">
                                    <StylizedIcon className="ri-user-line"></StylizedIcon>
                                </InputAdornment>
                            },
                        }}
                        error={props.error.error && props.error.type === 'username' ? true : false}
                        helperText={props.error.error && props.error.type === 'username' && props.error.message}
                    />
                    <FormField
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        size="small"
                        fullWidth
                        required
                        className="mb-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">
                                    <StylizedIcon className="ri-lock-line"></StylizedIcon>
                                </InputAdornment>,
                            }
                        }}
                        error={props.error.error && props.error.type === 'password' ? true : false}
                        helperText={props.error.error && props.error.type === 'password' && props.error.message}
                    />
                    <Typography variant="body2" color="primary">
                        <Link to="/recuperar-contraseña">¿Olvidaste tu contraseña?</Link>
                    </Typography>
                    <FormControlLabel control={<Checkbox onClick={(e) => setRememberMe(e.target.checked)} />} label={
                        <Typography variant="body2" color="primary">Mantener mi sesión</Typography>
                    } />
                    <Box sx={classes.submitBtnContainer}>
                        <Button loading={props.loading} type="submit" variant="contained" color="primary">
                            <Typography variant="body1">Iniciar sesión</Typography>
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default LoginForm;
