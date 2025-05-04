import React from 'react';
import PropTypes from 'prop-types';
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select as MuiSelect,
    useTheme
} from '@mui/material';

const Select = ({
    name,
    label,
    value,
    onChange,
    options = [],
    fullWidth = true,
    error,
}) => {
    const theme = useTheme();
    const labelId = `${label.replace(/\s+/g, '').toLowerCase()}-label`;

    return (
        <FormControl variant="outlined" fullWidth={fullWidth} size="small">
            <InputLabel id={labelId} shrink error={error ? true : false}>{label}</InputLabel>
            <MuiSelect
                name={name}
                labelId={labelId}
                value={value}
                onChange={onChange}
                label={label}
                displayEmpty
                error={error ? true : false}>
                {options.map((option, index) => (
                    <MenuItem sx={{ fontSize: theme.typography.fontSize, }} key={index} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </MuiSelect>
        </FormControl>
    );
};

Select.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.any.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
};

export default Select;