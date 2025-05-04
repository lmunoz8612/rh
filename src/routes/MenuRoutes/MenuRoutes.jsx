import React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    useTheme,
    styled,
} from '@mui/material';
import { Link } from 'react-router';
import { paths } from '../paths';
import { useAuth } from '../../context/Auth/Auth';

const StylizedListItem = styled(ListItem)(() => ({
    paddingTop: 4,
    paddingBottom: 4,
}));

const StylizedLink = styled(Link)(() => ({
    display: 'inline-flex',
    width: '100%',
}));

const MenuRoutes = ({ onClick }) => {
    const { role } = useAuth();
    const theme = useTheme();

    return (
        <List className="pd-1">
            {paths
                .filter(path => path.roles.includes(role))
                .map(({ id, path, label, icon, disabled }) => (
                    <StylizedListItem key={id} component="li" sx={{ opacity: disabled ? 0.5 : '', pointerEvents: disabled ? 'none' : '' }}>
                        <StylizedLink to={!disabled && path} onClick={onClick}>
                            {icon}<ListItemText primary={label} sx={{ color: theme.palette.common.white }} className="ml-1" />
                        </StylizedLink>
                    </StylizedListItem>
                ))}
        </List>
    )
};

export default MenuRoutes;