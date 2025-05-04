import React from 'react';
import {
    IconButton,
    TextField,
    InputAdornment
} from '@mui/material';
import { Clear, Visibility, VisibilityOff } from '@mui/icons-material';

const FormField = ({ name, label, type = 'text', value, onChange, slotProps = {}, ...props }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const togglePasswordVisibility = () => setShowPassword((prevState) => !prevState);

    const endAdornment = React.useMemo(() => {
        if (type === 'password') {
            return (
                <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ padding: 0.5 }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            );
        }
        else if (type === 'file') {
            return (
                <InputAdornment position="end">
                    <IconButton title="Borrar la imagen seleccionada" onClick={() => {
                        const inputFile = document.getElementsByName(name) && document.getElementsByName(name)[0];
                        if (inputFile) inputFile.value = '';
                    }} edge="end" sx={{ padding: 0.5 }}>
                        <Clear sx={{ mr: 1 }} />
                    </IconButton>
                </InputAdornment>
            );
        }
    }, [showPassword, name, type]);

    return (
        <TextField
            name={name}
            label={label}
            type={type === 'password' && showPassword ? 'text' : type}
            value={value}
            onChange={onChange}
            size="small"
            fullWidth
            slotProps={{
                input: { ...slotProps.input, endAdornment, },
                inputLabel: { ...slotProps?.inputLabel, shrink: true, },
                htmlInput: { ...slotProps.htmlInput, multiple: true }
            }}
            {...props}
        />
    );
};

export default FormField;