import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import GridLayout from '../../../components/GridLayout/GridLayout';
import {
    Button,
    Grid2 as Grid,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import FormField from '../../../components/Forms/FormField/FormField';
import RoleButton from '../../../components/RoleButton/RoleButton';
import Catalog from '../../../components/Catalog/Catalog';
import Notification from '../../../components/Notification/Notification';
import { ROLES } from '../../../assets/constants/constants';
import api from '../../../api/api';

const isFormInvalid = (formData) => (
    Object.entries(formData).some(([_, value]) => value === null || value === undefined || value === '')
);

const JobPositionForm = () => {
    const { id } = useParams();
    const user = useSelector(state => (state.user.data));
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        job_position: '',
        job_position_area_id: '',
        job_position_department_id: '',
        job_position_office_id: '',
        job_position_type_id: '',
        job_position_status_id: '1',
        job_position_admin_status_id: '1',
        job_position_parent_id: '',
        publish_date: today,
    });
    const [fillData, setFillData] = React.useState(false);
    const [notificationProps, setNotificationProps] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const [error, setError] = React.useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = React.useCallback(e => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
            ...(name === 'job_position_area_id' && prevState.job_position_area_id !== value ? { job_position_department_id: '', job_position_parent_id: '', } : {}),
        }));
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
        if (isFormInvalid(formData)) {
            setError(true);
            handleNotification('error', 'Favor de completar los campos faltantes.', '',);
            return;
        }

        try {
            setError(false);
            setLoading(true);
            const method = id ? api.put : api.post;
            const endpoint = id ? `job_position/${id}` : 'job_position';
            const { ok, message } = await method(endpoint, formData);
            handleNotification(ok ? 'success' : 'error', message, ok ? '/vacantes' : '',);
        }
        catch (error) {
            handleNotification('error', error.message);
        }
        finally {
            setLoading(false);
        }
    }, [id, formData, handleNotification]);

    const handleCancel = React.useCallback(() => navigate('/vacantes'), [navigate]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { ok, data } = await api.get(`job_position/positions/?id=${id}`);
                if (ok) {
                    setFormData(prevData => ({ ...prevData, ...data[0], }));
                }
            }
            catch (error) {
                console.log('Error al cargar la información: ', error);
            }
            finally {
                setFillData(true);
                setLoading(false);
            }
        };
        if (id) {
            fetchData();
        }
    }, [id]);

    if (id && !fillData) return (<></>);

    return (
        <GridLayout>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary" className="mb-3">{id ? 'EDITAR' : 'NUEVA'} VACANTE</Typography>
                <Grid container spacing={2}>
                    <Grid size={isSmallScreen ? 12 : 6}>
                        <FormField name="job_position" fullWidth label={'*Nombre de la Vacante'} value={formData.job_position || ''} onChange={handleChange} error={error && !formData.job_position ? true : false} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6}>
                        <Catalog name="job_position_area_id" apiEndpoint={'catalog/job_position/area/?available=1'} label={'*Área'} value={formData.job_position_area_id || ''} onChange={handleChange} error={error && !formData.job_position_area_id ? true : false} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6}>
                        <Catalog name="job_position_department_id" apiEndpoint={'catalog/job_position/department/?available=1'} label={'*Departamento'} value={formData.job_position_department_id || ''} onChange={handleChange} parentId={formData.job_position_area_id || ''} error={error && !formData.job_position_department_id ? true : false} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6}>
                        <Catalog name="job_position_office_id" apiEndpoint={'catalog/job_position/office/?available=1'} label={'*Oficina'} value={formData.job_position_office_id || ''} onChange={handleChange} error={error && !formData.job_position_office_id ? true : false} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6}>
                        <Catalog name="job_position_type_id" apiEndpoint={'catalog/job_position/type/?available=1'} label={'*Tipo de Vacante'} value={formData.job_position_type_id || ''} excludeOption={'3'} onChange={handleChange} error={error && !formData.job_position_type_id ? true : false} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6}>
                        <Catalog name="job_position_parent_id" apiEndpoint={'job_position/positions'} label={'*Jefe Inmediato'} value={formData.job_position_parent_id || ''} excludeOption={(id && user.fk_job_position_id === id) ? user.fk_job_position_id : ''} onChange={handleChange} error={error && !formData.job_position_parent_id ? true : false} />
                    </Grid>
                    <Grid size={12} textAlign={'right'}>
                        <Button variant="outlined" fullWidth={isSmallScreen ? true : false} className={isSmallScreen ? 'mt-1' : 'mr-1'} onClick={handleCancel} disabled={notificationProps.open || loading}>Cancelar</Button>
                        <RoleButton rolesAllowed={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} type="submit" variant="contained" color="primary" fullWidth={isSmallScreen ? true : false} className={isSmallScreen ? 'mt-1' : ''} onClick={handleSubmit} disabled={notificationProps.open || loading}>Guardar</RoleButton>
                    </Grid>
                </Grid>
            </Grid>
            <Notification
                {...notificationProps}
                onclose={() => setNotificationProps((prevState) => ({ ...prevState, open: false, }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} />
        </GridLayout>
    )
};

export default JobPositionForm;