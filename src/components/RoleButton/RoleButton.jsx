import React from 'react';
import { useAuth } from '../../context/Auth/Auth';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';

const RoleButton = React.memo(({ rolesAllowed, children, ...rest }) => {
    const { role } = useAuth();

    if (rolesAllowed && rolesAllowed.includes(role)) {
        return (
            <Button variant="contained" sx={{ bgcolor: 'primary.main' }} {...rest}>
                {children}
            </Button>
        )
    }

    return null;
});

RoleButton.propTypes = {
    rolesAllowed: PropTypes.array.isRequired,
};

export default RoleButton;