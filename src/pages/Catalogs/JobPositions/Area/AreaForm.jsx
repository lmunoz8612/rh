import React from 'react';
import { Link, useNavigate, useParams, } from 'react-router';
import GridLayout from '../../../../components/GridLayout/GridLayout';
import {
    Breadcrumbs,
    Button,
    Grid2 as Grid,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import FormField from '../../../../components/Forms/FormField/FormField';
import RoleButton from '../../../../components/RoleButton/RoleButton';
import Notification from '../../../../components/Notification/Notification';
import { ROLES } from '../../../../assets/constants/constants';
import api from '../../../../api/api';

const JobPositionAreaForm = () => {
    const { id, } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
    const [description, setDescription] = React.useState('');
    const [filledData, setFilledData] = React.useState(false);
    const [notificationProps, setNotificationProps] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = React.useCallback(e => {
        e.preventDefault();
        setDescription(e.target.value);
    }, []);

    const handleNotification = React.useCallback((severity, message, redirectTo = null) => {
        setNotificationProps({
            open: true,
            severity,
            message,
            redirectTo,
            duration: 3000,
        });
    }, []);

    const handleSubmit = React.useCallback(async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            handleNotification('error', 'Ingresar una nombre de Área válido.',);
            return;
        }

        const payload = id ? { id, description, } : { description, };
        const method = id ? api.put : api.post;
        const endpoint = 'catalog/job_position/area';

        try {
            setLoading(true);
            const { ok, message } = await method(endpoint, payload);
            handleNotification(ok ? 'success' : 'error', message, ok ? '/catalogos/vacantes/area' : '',);
        }
        catch (error) {
            handleNotification('error', error.message);
        }
        finally {
            setLoading(false);
        }
    }, [id, description, handleNotification]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`catalog/job_position/area/?id=${id}`);
                setDescription(data.job_position_area);
            }
            catch (error) {
                handleNotification('error', error.message);
            }
            finally {
                setFilledData(true);
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id, handleNotification]);

    if (id && !filledData) return (<></>);

    return (
        <GridLayout>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary">{id ? 'EDITAR' : 'NUEVA'} ÁREA</Typography>
                <Breadcrumbs className="mt-2">
                    <Link to={'/catalogos'}>
                        <Typography variant="body2" color="primary">Vacantes</Typography>
                    </Link>
                    <Link to={'/catalogos/vacantes/area'}>
                        <Typography variant="body2" color="primary">Área</Typography>
                    </Link>
                    <Typography variant="body2" color="textSecondary">Nuevo</Typography>
                </Breadcrumbs>
                <form onSubmit={handleSubmit}>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField label={'Área'} value={description} onChange={handleChange} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent="flex-end" spacing={2}>
                            <Button type="button" variant="outlined" onClick={() => navigate('/catalogos/vacantes/area')} disabled={notificationProps.open || loading}>Cancelar</Button>
                            <RoleButton type="submit" loading={loading} rolesAllowed={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} disabled={notificationProps.open || loading}>Guardar</RoleButton>
                        </Stack>
                    </Grid>
                </form>
            </Grid>
            <Notification
                {...notificationProps}
                onclose={() => setNotificationProps((prevState) => ({ ...prevState, open: false, }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} />
        </GridLayout>
    );
};

export default JobPositionAreaForm;
