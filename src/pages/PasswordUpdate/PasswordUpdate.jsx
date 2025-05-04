import React from 'react';
import { useNavigate } from 'react-router';
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

const PasswordUpdate = () => {
    const { auth, } = useAuth();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [notificationProps, setNotificationProps] = React.useState({
        open: false,
        severity: 'success',
        message: '',
        duration: 3000,
    });
    const token = React.useMemo(() => new URLSearchParams(window.location.search).get('token'), []);

    const handleSubmit = React.useCallback(async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setNotificationProps({
                open: true,
                severity: 'error',
                message: 'La contraseña no coincide',
            });
            return;
        }

        try {
            setLoading(true);
            let { ok, message } = await api.post('login/password_update', { token, newPassword, confirmPassword });
            setNotificationProps({ open: true, severity: ok ? 'success' : 'error', message, redirectTo: '/login', });
        }
        catch (error) {
            setNotificationProps({ open: true, severity: 'error', message: error?.message, });
        }
        finally {
            setLoading(false);
        }
    }, [token, newPassword, confirmPassword]);

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
                    Has solicitado el cambio de contraseña.
                </Typography>
                <form onSubmit={(e) => handleSubmit(e)} style={classes.form}>
                    <FormField
                        label="Nueva contraseña"
                        variant="outlined"
                        type="password"
                        size="small"
                        fullWidth
                        required
                        className="mb-2"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value.trim())}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">
                                    <StylizedIcon className="ri-lock-line"></StylizedIcon>
                                </InputAdornment>,
                            },
                        }}
                        error={notificationProps.severity === 'error'}
                    />
                    <FormField
                        label="Confirmar contraseña"
                        variant="outlined"
                        type="password"
                        size="small"
                        fullWidth
                        required
                        className="mb-2"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value.trim())}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">
                                    <StylizedIcon className="ri-lock-line"></StylizedIcon>
                                </InputAdornment>,
                            },
                        }}
                        error={notificationProps.severity === 'error'}
                        helperText={notificationProps.severity === 'error' ? notificationProps.message : ''}
                    />
                    <Box sx={classes.submitBtnContainer}>
                        <Button loading={loading} type="submit" variant="contained" color="primary" sx={classes.submitBtn} className="mt-2" disabled={notificationProps.open || loading}>
                            <Typography variant="body1">Actualizar contraseña</Typography>
                        </Button>
                    </Box>
                </form>
            </Box>
            <Notification
                {...notificationProps}
                onclose={() => setNotificationProps((prevState) => ({ ...prevState, open: false, }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} />
        </Container>
    )
};

export default PasswordUpdate;