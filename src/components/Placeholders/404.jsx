import React from 'react';
import { LinkOff, } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const NoPage = ({
    title = 'No existen la página.',
    subtitle = '404 Not Found',
    iconSize = 60,
    iconColor = 'error.main',
    titleColor = 'error',
    subtitleColor = 'primary',
}) => (
    <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="80%"
        textAlign="center">
        <LinkOff sx={{ fontSize: iconSize, color: iconColor, }} />
        <Typography variant="h6" color={titleColor} mt={1}>{title}</Typography>
        <Typography variant="body2" color={subtitleColor}>{subtitle}</Typography>
    </Box>
);

export default NoPage;