import React from 'react';
import { Link } from 'react-router';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Grid2 as Grid,
    styled,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import GridLayout from '../../components/GridLayout/GridLayout';
import catalogsConfig from './CatalogsConfig';
import { KeyboardArrowDown } from '@mui/icons-material';

// Estilos personalizados
const Icon = styled('i')(({ theme }) => ({
    color: theme.palette.primary.main,
    fontSize: '1rem',
}));

const LinkStylized = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.main,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
}));

const CatalogList = () => {
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <GridLayout>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary" className="mb-2">CATÁLOGOS</Typography>
                {catalogsConfig.map(({ name, label, children }) => (
                    <Accordion key={name} sx={{ width: '100%' }} defaultExpanded={true} disableGutters>
                        <AccordionSummary expandIcon={<KeyboardArrowDown />}>
                            <Typography variant="body1" fontWeight="bold" color="primary">
                                {label}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container>
                                {children.map(({ name, label, icon, path }) => (
                                    <Grid key={name} size={isMediumScreen ? 12 : 2}>
                                        <LinkStylized to={path}>
                                            <Icon className={icon} />
                                            <Typography variant="body2" color="primary" sx={{ ml: 1 }}>
                                                {label}
                                            </Typography>
                                        </LinkStylized>
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Grid>
        </GridLayout>
    );
};

export default CatalogList;
