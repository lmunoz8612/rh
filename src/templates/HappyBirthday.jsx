import React from 'react';
import {
    Avatar,
    Box,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import logo from 'assets/imgs/logo.jpg';

const HappyBirthday = ({ keyIndex, userData, isMediumScreen, ...rest }) => {
    const theme = useTheme();
    return (
        <Box
            key={keyIndex}
            sx={{
                textAlign: 'center',
                backgroundColor: theme.palette.primary.main,
                margin: 0,
                padding: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                ...rest
            }}>
            <h1 style={{ color: theme.palette.common.white, fontSize: isMediumScreen ? theme.typography.fontSize : theme.typography.fontSize * 3, fontWeight: 'bold' }}>
                🎉¡RH te desea Feliz Cumpleaños!🎂
            </h1>
            <Box
                sx={{
                    background: theme.palette.common.white,
                    padding: 1,
                    borderRadius: 2,
                    mb: 2,
                    maxWidth: '70%',
                    color: theme.palette.primary.main,
                    position: 'relative',
                    width: '100%',
                }}>
                <Box p={1}>
                    <Stack direction="column" alignItems="center" mb={2}>
                        <Avatar src={userData.file ? `data:image/${userData.file_extension};base64,${userData.file}` : ''} sx={{ height: isMediumScreen ? '70px' : '100px', width: isMediumScreen ? '70px' : '100px', ml: 1, }} />
                        <Typography variant="body1" color="primary" fontWeight="bold" className="ml-1">
                            {userData.user_full_name}
                        </Typography>
                        <Typography variant="body2" color="primary" className="ml-1">
                            {userData.birthday_date}
                        </Typography>
                    </Stack>
                </Box>
                <Typography variant={isMediumScreen ? 'body2' : 'h6'} color="primary" fontWeight="bold">
                    En este día especial, queremos felicitarte y agradecerte por tu esfuerzo y dedicación.
                    Esperamos que este nuevo año de vida esté lleno de grandes logros, alegría y momentos inolvidables junto a tus seres queridos.
                    ¡Disfruta tu día al máximo!
                </Typography>
                <Typography variant={isMediumScreen ? 'body2' : 'h5'} color="primary" fontWeight="bold" mt={2}>Atentamente.</Typography>
                <img
                    src={logo}
                    alt="RH"
                    style={{ marginTop: theme.shape.margin * 2, width: isMediumScreen ? '100%' : '50%', }}
                />
            </Box>
        </Box>
    )
};

export default HappyBirthday;