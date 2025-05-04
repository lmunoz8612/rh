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
import { ROLES } from '../../../../assets/constants/constants';
import api from '../../../../api/api';
import Notification from '../../../../components/Notification/Notification';

const JobPositionTypeForm = () => {
    const { id, } = useParams();
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
    const navigate = useNavigate();

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
            handleNotification('error', 'Ingresar un nombre de Tipo de Vacante válido.',);
            return;
        }

        const payload = id ? { id, description, } : { description, };
        const method = id ? api.put : api.post;
        const endpoint = 'catalog/job_position/type';

        try {
            setLoading(true);
            const { ok, message } = await method(endpoint, payload);
            handleNotification(ok ? 'success' : 'error', message, ok ? '/catalogos/vacantes/tipo-vacante' : '',);
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
                const { data } = await api.get(`catalog/job_position/type/?id=${id}`);
                setDescription(data.job_position_type);
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
                <Typography variant="h6" fontWeight="bold" color="primary">NUEVO TIPO DE VACANTE</Typography>
                <Breadcrumbs className="mt-2">
                    <Link to={'/catalogos'}>
                        <Typography variant="body2" color="primary">Vacantes</Typography>
                    </Link>
                    <Link to={'/catalogos/vacantes/tipo-vacante'}>
                        <Typography variant="body2" color="primary">Tipo de Vacante</Typography>
                    </Link>
                    <Typography variant="body2" color="textSecondary">Nuevo</Typography>
                </Breadcrumbs>
                <form onSubmit={handleSubmit}>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField label={'Tipo de Vacante'} value={description} onChange={handleChange} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent="flex-end" spacing={2}>
                            <Button variant="outlined" onClick={() => navigate('/catalogos/vacantes/tipo-vacante')} disabled={notificationProps.open || loading}>Cancelar</Button>
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

export default JobPositionTypeForm;
