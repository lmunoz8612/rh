import React from 'react';
import PropTypes from 'prop-types';
import {
    IconButton,
    Menu,
    MenuItem,
    Tooltip,
    Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MoreVert = ({ options }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    options.disabled = false;

    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <div>
            <IconButton color="primary" onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {options.map((option, index) => (
                    <Tooltip title={option.title} arrow>
                        <MenuItem key={index} onClick={option.onClick} disabled={option.disabled}>
                            <Typography variant="body2" color="primary">
                                {option.label}
                            </Typography>
                        </MenuItem>
                    </Tooltip>
                ))}
            </Menu>
        </div>
    );
};

MoreVert.propTypes = {
    options: PropTypes.array.isRequired,
};

export default MoreVert;
