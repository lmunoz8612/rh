import React from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import {
    Snackbar,
    Alert
} from '@mui/material';

const Notification = (props) => {
    const {
        open,
        severity,
        duration,
        onclose,
        anchorOrigin,
        message,
        redirectTo = ''
    } = props;
    const navigate = useNavigate();

    const handleClose = React.useCallback((e, reason) => {
        if (reason === 'clickaway') return;
        onclose();
        if (redirectTo) navigate(redirectTo);
    }, [redirectTo, onclose, navigate]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={duration || 6000}
            onClose={handleClose}
            anchorOrigin={anchorOrigin}>
            <Alert onClose={handleClose} severity={severity}>{message}</Alert>
        </Snackbar>
    )
};

Notification.propTypes = {
    open: PropTypes.bool.isRequired,
    duration: PropTypes.number,
    onclose: PropTypes.func.isRequired,
    anchorOrigin: PropTypes.object,
    message: PropTypes.string.isRequired,
    redirectTo: PropTypes.string,
};

export default Notification;