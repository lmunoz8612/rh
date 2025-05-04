import React from 'react';
import { useAuth } from '../../context/Auth/Auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as userAction from '../../redux/actions/userActions';
import api from '../../api/api';

const Logout = () => {
    const { auth, logout } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (auth) {
            api.post('logout', {})
                .then(data => {
                    logout();
                    dispatch(userAction.logout());
                    navigate('/login');
                    window.location.reload();
                })
                .catch(error => `Ha ocurrido un error: ${error}`);
        }
    }, [auth, logout, dispatch, navigate]);

    return (<></>)
};

export default Logout;