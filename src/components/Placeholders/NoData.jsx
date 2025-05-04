import React from 'react';
import { SearchOff } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const NoData = ({
    title = 'No existen datos para mostrar',
    subtitle = 'No se encontró la información solicitada, intenta más tarde.',
    iconSize = 60,
    iconColor = 'error.main',
    titleColor = 'error',
    subtitleColor = 'primary',
    mt = 20,
}) => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={mt}
        width="100%"
        textAlign="center">
        <SearchOff sx={{ fontSize: iconSize, color: iconColor, }} />
        <Typography variant="h6" color={titleColor} mt={1}>{title}</Typography>
        <Typography variant="body2" color={subtitleColor}>{subtitle}</Typography>
    </Box>
);

export default NoData;
