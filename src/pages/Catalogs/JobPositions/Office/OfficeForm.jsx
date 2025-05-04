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

const JobPositionOfficeForm = () => {
    const { id, } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        description: '',
        shortName: '',
        address: '',
    });
    const [filledData, setFilledData] = React.useState(false);
    const [notificationProps, setNotificationProps] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = React.useCallback(e => {
        setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value }));
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
        if (!formData.description.trim() || !formData.address.trim() || !formData.shortName.trim()) {
            handleNotification('error', 'Ingresar un nombre de Oficina, Nombre Corto y Dirección válida.',);
            return;
        }

        const payload = id ?
            { id, description: formData.description, shortname: formData.shortName, address: formData.address, }
            :
            { description: formData.description, shortname: formData.shortName, address: formData.address, };
        const method = id ? api.put : api.post;
        const endpoint = 'catalog/job_position/office';

        try {
            setLoading(true);
            const { ok, message } = await method(endpoint, payload);
            handleNotification(ok ? 'success' : 'error', message, ok ? '/catalogos/vacantes/oficina' : '',);
        }
        catch (error) {
            handleNotification('error', error.message);
        }
        finally {
            setLoading(false);
        }
    }, [id, formData.description, formData.shortName, formData.address, handleNotification]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`catalog/job_position/office/?id=${id}`);
                setFormData(prevData => ({
                    ...prevData,
                    description: data.job_position_office,
                    shortName: data.job_position_office_short,
                    address: data.job_position_office_address,
                }));
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
                <Typography variant="h6" fontWeight="bold" color="primary">{id ? 'EDITAR' : 'NUEVA'} OFICINA</Typography>
                <Breadcrumbs className="mt-2">
                    <Link to={'/catalogos'}>
                        <Typography variant="body2" color="primary">Vacantes</Typography>
                    </Link>
                    <Link to={'/catalogos/vacantes/oficina'}>
                        <Typography variant="body2" color="primary">Oficina</Typography>
                    </Link>
                    <Typography variant="body2" color="textSecondary">Nuevo</Typography>
                </Breadcrumbs>
                <form onSubmit={handleSubmit}>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField name="description" label={'Oficina'} value={formData.description} onChange={handleChange} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField name="shortName" label={'Nombre Corto'} value={formData.shortName} onChange={handleChange} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField name="address" label={'Dirección'} value={formData.address} onChange={handleChange} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent="flex-end" spacing={2}>
                            <Button variant="outlined" onClick={() => navigate('/catalogos/vacantes/oficina')} disabled={notificationProps.open || loading}>Cancelar</Button>
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

export default JobPositionOfficeForm;
