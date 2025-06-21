import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router';
import MenuRoutes from '../../routes/MenuRoutes/MenuRoutes.jsx';
import {
    useMediaQuery,
    useTheme,
    Box,
    Drawer,
    IconButton,
    Avatar,
    Typography,
    Stack
} from '@mui/material';
import { Menu } from '@mui/icons-material';
import { isEmptyObject } from '../../assets/utils/utils.js';
import logo from '../../assets/imgs/logo.jpg';

const Sidebar = () => {
    const user = useSelector((state) => state.user.data);
    const navigate = useNavigate();

    const [openSidebar, setOpenSidebar] = React.useState(false);
    const handleSidebarToggle = React.useCallback(() => setOpenSidebar(!openSidebar), [openSidebar]);
    const handleAvatarClick = React.useCallback(() => navigate('/perfil'), [navigate]);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const drawerWidth = 220; // px.

    React.useEffect(() => {
        if (isSmallScreen) {
            setOpenSidebar(false);
        }
    }, [isSmallScreen]);

    if (isEmptyObject(user)) return (<></>);

    return (
        <>
            {isSmallScreen &&
                <Box marginTop={1}>
                    <IconButton onClick={handleSidebarToggle}>
                        <Menu />
                    </IconButton>
                </Box>}
            <Drawer
                anchor="left"
                open={isSmallScreen ? openSidebar : true}
                PaperProps={{ sx: { backgroundColor: theme.palette.primary.main, flexShrink: 0, overflowY: 'hidden', width: drawerWidth, }, }}
                ModalProps={{ sx: { backgroundColor: 'transparent', }, open: isSmallScreen ? openSidebar : true }}
                onClose={handleSidebarToggle}
                variant={isSmallScreen ? 'temporary' : 'permanent'}
                sx={{ width: drawerWidth, }}>
                <Box sx={{ backgroundColor: theme.palette.common.white, }} className="pd-2">
                    <Link to="/home">
                        <img src={logo} alt="logo" width={'50%'} title='VICA' />
                    </Link>
                </Box>
                <Box className="pd-2" overflow="auto" textAlign="left">
                    <Stack
                        direction="row"
                        alignItems="center"
                        marginLeft={2}
                        spacing={2}
                        sx={{
                            cursor: "pointer"
                        }}
                        onClick={handleAvatarClick}>
                        <Avatar src={user?.profile_picture || ''} />
                        {(user?.first_name && user?.last_name_1 && user?.last_name_2) ?
                            <Typography variant="body1" fontWeight="bold" color="white">{`${user?.first_name} ${user?.last_name_1} ${user?.last_name_2}`}</Typography>
                            :
                            <Typography variant="body1" fontWeight="bold" color="white"></Typography>}
                    </Stack>
                    <MenuRoutes onClick={handleSidebarToggle} />
                </Box>
            </Drawer>
        </>
    );
};

export default Sidebar;