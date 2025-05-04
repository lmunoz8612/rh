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
import Catalog from '../../../../components/Catalog/Catalog';

const JobPositionDepartmentForm = () => {
    const { id, } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        area: '',
        description: '',
        shortName: '',
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
        if (!formData.area || !formData.description.trim()) {
            handleNotification('error', 'Ingresar un Área y nombre de Departamento válido.',);
            return;
        }

        const payload = id ?
            { id, area: formData.area, description: formData.description, shortname: formData.shortName, }
            :
            { area: formData.area, description: formData.description, shortname: formData.shortName, };
        const method = id ? api.put : api.post;
        const endpoint = 'catalog/job_position/department';

        try {
            setLoading(true);
            const { ok, message } = await method(endpoint, payload);
            handleNotification(ok ? 'success' : 'error', message, ok ? '/catalogos/vacantes/departamento' : '',);
        }
        catch (error) {
            handleNotification('error', error.message);
        }
        finally {
            setLoading(false);
        }
    }, [id, formData.area, formData.description, formData.shortName, handleNotification]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(`catalog/job_position/department/?id=${id}`);
                setFormData(prevData => ({
                    ...prevData,
                    area: data.fk_job_position_area_id,
                    description: data.job_position_department,
                    shortName: data.job_position_department_short,
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
                <Typography variant="h6" fontWeight="bold" color="primary">{id ? 'EDITAR' : 'NUEVO'} DEPARTAMENTO</Typography>
                <Breadcrumbs className="mt-2">
                    <Link to={'/catalogos'}>
                        <Typography variant="body2" color="primary">Vacantes</Typography>
                    </Link>
                    <Link to={'/catalogos/vacantes/departamento'}>
                        <Typography variant="body2" color="primary">Departamento</Typography>
                    </Link>
                    <Typography variant="body2" color="textSecondary">Nuevo</Typography>
                </Breadcrumbs>
                <form onSubmit={handleSubmit}>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        {!id && <Catalog name="area" apiEndpoint={'catalog/job_position/area'} label={'Área'} value={formData.area} onChange={handleChange} />}
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField name="description" label={'Departamento'} value={formData.description || ''} onChange={handleChange} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField name="shortName" label={'Nombre Corto'} value={formData.shortName || ''} onChange={handleChange} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent="flex-end" spacing={2}>
                            <Button variant="outlined" onClick={() => navigate('/catalogos/vacantes/departamento')} disabled={notificationProps.open || loading}>Cancelar</Button>
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

export default JobPositionDepartmentForm;
