import React from 'react';
import { Lock } from '@mui/icons-material';
import {
    Box,
    Typography
} from '@mui/material';

const PermissionDenied = ({
    title = 'Acceso Denegado',
    subtitle = 'No tienes permiso de acceso a este recurso.',
    iconSize = 60,
    iconColor = 'error.main',
    titleColor = 'error',
    subtitleColor = 'primary',
}) => (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="80%">
        <Lock sx={{ fontSize: iconSize, color: iconColor, }} />
        <Typography variant="h6" color={titleColor} mt={1}>{title}</Typography>
        <Typography variant="body2" color={subtitleColor}>{subtitle}</Typography>
    </Box>
);

export default PermissionDenied;
