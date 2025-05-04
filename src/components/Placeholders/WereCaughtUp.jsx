import React from 'react';
import { CheckCircleOutline, } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';

const WereCaughtUp = ({
    title = 'Todo esta al día',
    subtitle = 'Pronto aparecerán publicaciónes en esta sección...',
    iconSize = 60,
    iconColor = 'primary.main',
    titleColor = 'primary',
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
        <CheckCircleOutline sx={{ fontSize: iconSize, color: iconColor, }} />
        <Typography variant="h6" color={titleColor} mt={1}>{title}</Typography>
        <Typography variant="body2" color={subtitleColor}>{subtitle}</Typography>
    </Box>
);

export default WereCaughtUp;
