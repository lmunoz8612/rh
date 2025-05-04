import React from 'react';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../context/Auth/Auth';
import { login as reduxlogin } from '../../redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import CryptoJS from "crypto-js";
import LoginForm from './LoginForm/LoginForm';
import api from '../../api/api';
import Notification from '../Notification/Notification';

const Login = () => {
    const { auth, login } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState({ error: false, type: '', message: '', });
    const [notificationProps, setNotificationProps] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const encryptedPassword = (password) => {
        const iv = CryptoJS.lib.WordArray.random(16);
        const secretKey = process.env.REACT_APP_ENCRIPT_PASSWORD_KEY || window.env.REACT_APP_ENCRIPT_PASSWORD_KEY;
        const encrypted = CryptoJS.AES.encrypt(password, CryptoJS.enc.Utf8.parse(secretKey), {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
    };

    const handleNotification = React.useCallback((severity, message, redirectTo = null) => {
        setNotificationProps({
            open: true,
            severity,
            message,
            redirectTo,
            duration: 3000,
        });
    }, []);

    const handleSubmit = React.useCallback(async (e, user) => {
        e.preventDefault();
        try {
            setLoading(true);
            const responseLogin = await api.post('login', {
                username: user.username,
                password: encryptedPassword(user.password).toString(),
                rememberMe: user.rememberMe,
            });
            if (responseLogin.ok) {
                login(responseLogin.pk_role_id, responseLogin.has_signed_policies);
                const responseUser = await api.get(`user/?id=${responseLogin.pk_user_id}`);
                if (responseUser.ok) {
                    dispatch(reduxlogin(responseUser.user));
                    if (responseUser?.has_signed_policies && parseInt(responseUser.has_signed_policies) === 0) {
                        navigate('/politicas-empresa');
                    }
                    else {
                        navigate('/home');
                    }
                }
                setError({ error: true, type: responseUser.type, message: responseUser.message, });
            }
            else {
                handleNotification('error', `Ha ocurrido un error: ${responseLogin.message}`, '',);
            }
        }
        catch (error) {
            handleNotification('error', `Ha ocurrido un error: ${error}`, '',);
        }
        finally {
            setLoading(false);
        }
    }, [dispatch, login, navigate, handleNotification]);

    React.useEffect(() => {
        if (auth) {
            navigate('/home');
        }
    }, [auth, navigate,]);

    return (
        <>
            <LoginForm onSubmit={handleSubmit} loading={loading} error={{ ...error }} />
            <Notification
                {...notificationProps}
                onclose={() => setNotificationProps((prevState) => ({ ...prevState, open: false, }))}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }} />
        </>
    );
};

export default Login;