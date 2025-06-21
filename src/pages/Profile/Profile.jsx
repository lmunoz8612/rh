import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update } from '../../redux/actions/userActions.js';
import { useNavigate } from 'react-router';
import {
    Avatar,
    Box,
    Button,
    Grid2 as Grid,
    // IconButton,
    styled,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import FormField from '../../components/Forms/FormField/FormField';
import GridLayout from '../../components/GridLayout/GridLayout';
import Catalog from '../../components/Catalog/Catalog';
import Notification from '../../components/Notification/Notification';
import api from '../../api/api';

const StyledButton = styled(Button)(() => ({
    minWidth: '20%',
}));

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data);

    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        work_phone: user.work_phone || '',
        first_name: user.first_name || '',
        last_name_1: user.last_name_1 || '',
        last_name_2: user.last_name_2 || '',
        birth_date: user.birth_date || '',
        fk_marital_status_id: user.fk_marital_status_id || '',
        personal_email: user.personal_email || '',
        cel_phone: user.cel_phone || '',
        curp: user.curp || '',
        rfc: user.rfc || '',
        imss: user.imss || '',
        infonavit: user.infonavit || '',
        emergency_name: user.emergency_name || '',
        fk_emergency_relationship_id: user.fk_emergency_relationship_id || '',
        emergency_phone: user.emergency_phone || '',
    });
    const [notificationProps, setNotificationProps] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });

    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const StyledAvatar = styled(Avatar)(() => ({
        height: isMediumScreen ? '35vw' : '10vw',
        margin: '0 auto',
        width: isMediumScreen ? '35vw' : '10vw',
    }));

    const handleChange = React.useCallback(e => {
        setFormData(prevData => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
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
        try {
            setLoading(true);
            const { ok, message } = await api.put(`user/${user.pk_user_id}`, formData);
            if (ok) {
                dispatch(update(formData));
                handleNotification('success', message, null);
            }
        }
        catch (error) {
            handleNotification('error', `Error en la solicitud: ${error}`, null);
        }
        finally {
            setLoading(false);
        }
    }, [user.pk_user_id, formData, dispatch, handleNotification]);

    return (
        <GridLayout columnSpacing={3}>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary">MI PERFIL</Typography>
                <Grid container spacing={2}>
                    {!isMediumScreen && <Grid size={2}></Grid>}
                    {!isMediumScreen &&
                        <Grid size={10} textAlign="left">
                            <Typography variant="body1" fontWeight="bold" color="primary" sx={{ mb: 1, }}>Cuenta</Typography>
                        </Grid>}
                    <Grid size={isMediumScreen ? 12 : 2} textAlign="center">
                        <StyledAvatar src={user.file ? `data:image/${user.file_extension};base64,${user.file}` : ''} />
                        {/*
                        <Box textAlign={isMediumScreen ? 'center' : 'right'}>
                            <IconButton sx={{ padding: 0.3, }}><StylizedIcon className="ri-image-edit-line" /></IconButton>
                            <IconButton sx={{ padding: 0.3, }}><StylizedIcon className="ri-delete-bin-line" /></IconButton>
                        </Box>
                        */}
                    </Grid>
                    {isMediumScreen &&
                        <Grid size={10} textAlign="left">
                            <Typography variant="body1" fontWeight="bold" color="primary">Cuenta</Typography>
                        </Grid>}
                    <Grid size={isMediumScreen ? 12 : 5} sx={{ mt: isMediumScreen ? 1 : '', }}>
                        <FormField label="Usuario" value={user.username || ''} disabled />
                        <FormField name="work_phone" label="Teléfono de Trabajo" value={formData.work_phone || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 10, } }} />
                        <FormField label="Area" value={user.job_position_area || ''} sx={{ mt: 2, }} disabled />
                        <FormField label="Oficina" value={user.job_position_office || ''} sx={{ mt: 2, }} disabled />
                    </Grid>
                    <Grid size={isMediumScreen ? 12 : 5}>
                        <FormField label="Correo Electrónico Institucional" value={user.institutional_email || ''} disabled />
                        <FormField label="Puesto" value={user.job_position || ''} sx={{ mt: 2, }} disabled />
                        <FormField label="Departamento" value={user.job_position_department || ''} sx={{ mt: 2, }} disabled />
                        <FormField label="Fecha de Ingreso" type="date" value={user.date_of_hire ? user.date_of_hire.split(' ')[0] : ''} sx={{ mt: 2, }} disabled />
                    </Grid>
                    {!isMediumScreen && <Grid size={isMediumScreen ? 12 : 2} textAlign="left" sx={{ mt: isMediumScreen ? 1 : '', }}></Grid>}
                    <Grid size={isMediumScreen ? 12 : 5} textAlign="left" mt={isMediumScreen ? 0 : 2} mb={isMediumScreen ? 0 : 2}>
                        <Typography variant="body1" fontWeight="bold" color="primary">Datos personales</Typography>
                    </Grid>
                    {!isMediumScreen && <Grid size={5}></Grid>}
                    {!isMediumScreen &&
                        <Grid size={2}>
                            <Grid container textAlign="center" spacing={2}></Grid>
                        </Grid>}
                    <Grid size={isMediumScreen ? 12 : 5}>
                        <FormField name="first_name" label="Nombre" value={formData.first_name || ''} onChange={handleChange} />
                        <FormField name="last_name_2" label="Apellido Materno" value={formData.last_name_2 || ''} sx={{ mt: 2, }} onChange={handleChange} />
                        <Catalog
                            name="fk_marital_status_id"
                            apiEndpoint="catalog/user/marital_status/?available=1"
                            label="Estado Civil"
                            value={formData.fk_marital_status_id}
                            onChange={handleChange}
                            className="mt-2" />
                        <FormField name="cel_phone" label="Télefono personal" value={formData.cel_phone || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 10, } }} />
                        <FormField name="rfc" label="RFC" value={formData.rfc || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 13, } }} />
                        <FormField name="infonavit" label="Infonavit" value={formData.infonavit || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 10, } }} />
                        <Catalog
                            name="fk_emergency_relationship_id"
                            apiEndpoint="catalog/user/relationships/?available=1"
                            label="Parentesco del Contacto de Emergencia"
                            value={formData.fk_emergency_relationship_id}
                            onChange={handleChange}
                            className="mt-2" />
                    </Grid>
                    <Grid size={isMediumScreen ? 12 : 5}>
                        <FormField name="last_name_1" label="Apellido Paterno" value={formData.last_name_1 || ''} onChange={handleChange} />
                        <FormField name="birth_date" label="Fecha de Nacimiento" type="date" value={formData.birth_date || ''} sx={{ mt: 2, }} onChange={handleChange} disabled />
                        <FormField name="personal_email" label="Correo Personal" value={formData.personal_email || ''} sx={{ mt: 2, }} onChange={handleChange} />
                        <FormField name="curp" label="CURP" value={formData.curp || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 18, } }} />
                        <FormField name="imss" label="IMSS" value={formData.imss || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 11, } }} />
                        <FormField name="emergency_name" label="Nombre de Contacto de Emergencia" value={formData.emergency_name || ''} sx={{ mt: 2, }} onChange={handleChange} />
                        <FormField name="emergency_phone" label="Número de Emergencia" value={formData.emergency_phone || ''} sx={{ mt: 2, }} onChange={handleChange} />
                    </Grid>
                    {!isMediumScreen && <Grid size={2}></Grid>}
                    <Grid size={isMediumScreen ? 12 : 5}></Grid>
                    <Grid size={isMediumScreen ? 12 : 5} textAlign="right" sx={{ mt: isMediumScreen ? 1 : '' }}>
                        <Box marginTop="auto">
                            <StyledButton variant="outlined" fullWidth={isMediumScreen ? true : false} className={isMediumScreen ? 'mt-1' : 'mr-1'} onClick={() => navigate('/home')}>Cancelar</StyledButton>
                            <StyledButton variant="contained" color="primary" fullWidth={isMediumScreen ? true : false} className={isMediumScreen ? 'mt-1' : ''} onClick={handleSubmit} disabled={notificationProps.open || loading}>Guardar Cambios</StyledButton>
                        </Box>
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

export default Profile;