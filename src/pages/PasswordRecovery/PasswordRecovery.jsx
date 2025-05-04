import React from 'react';
import { Link, useNavigate, } from 'react-router';
import { useAuth } from '../../context/Auth/Auth.js';
import {
    Box,
    Button,
    Container,
    InputAdornment,
    styled,
    Typography
} from '@mui/material';
import FormField from '../../components/Forms/FormField/FormField.jsx';
import Notification from '../../components/Notification/Notification.jsx';
import logo from '../../assets/imgs/logo.jpg';
import api from '../../api/api.js';

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
        marginBottom: 32,
        width: '50%',
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

const PasswordRecovery = () => {
    const { auth, } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [notificationProps, setNotificationProps] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const handleSubmit = React.useCallback(async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { ok, message } = await api.post('login/password_recovery', { username: username, });
            setNotificationProps({ open: true, severity: ok ? 'success' : 'error', message, });
        }
        catch (error) {
            setNotificationProps({ open: true, severity: 'error', message: error?.message, });
        }
        finally {
            setLoading(false);
        }
    }, [username]);

    React.useEffect(() => {
        if (auth) {
            navigate('/home');
        }
    }, [auth, navigate,]);

    return (
        <Container maxWidth="xs">
            <Box sx={classes.container} className="pd-3">
                <img src={logo} alt="logo" style={classes.logo} />
                <Typography variant="body2" className="mb-4" fontWeight="bold" color="text.primary">
                    Escribe el usuario del cuál quiere recuperar su contraseña.<br />Te llegará una notificación al correo asociado a la cuenta para continuar.
                </Typography>
                <form onSubmit={(e) => handleSubmit(e)} style={classes.form}>
                    <FormField
                        label="Usuario"
                        variant="outlined"
                        size="small"
                        fullWidth
                        required
                        className="mb-1"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.trim())}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">
                                    <StylizedIcon className="ri-user-line"></StylizedIcon>
                                </InputAdornment>
                            },
                        }}
                        error={notificationProps.severity === 'error'}
                        helperText={notificationProps.severity === 'error' ? notificationProps.message : ''}
                    />
                    <Typography variant="body2" color="primary" ml={0.5}><Link to="/login">Iniciar sesión</Link></Typography>
                    <Box sx={classes.submitBtnContainer}>
                        <Button loading={loading} type="submit" variant="contained" color="primary" sx={classes.submitBtn} className="mt-2" disabled={notificationProps.open || loading}>
                            <Typography variant="body1">Recuperar contraseña</Typography>
                        </Button>
                    </Box>
                </form>
            </Box>
            <Notification
                {...notificationProps}
                onclose={() => setNotificationProps((prevState) => ({ ...prevState, open: false, duration: 3000, }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} />
        </Container>
    )
};

export default PasswordRecovery;