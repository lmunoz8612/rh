import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update } from 'store/actions/userActions.js';
import { useNavigate } from 'react-router';
import {
    Avatar,
    Box,
    Button,
    Grid2 as Grid,
    styled,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import FormField from 'components/Forms/FormField/FormField';
import GridLayout from 'components/GridLayout/GridLayout';
import Catalog from 'components/Catalog/Catalog';
import Notification from 'components/Notification/Notification';
import api from 'api/api';

const StyledButton = styled(Button)(() => ({
    minWidth: '20%',
}));

const Profile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.data);

    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const getInitialFormData = React.useCallback((user) => ({
        work_phone: user.work_phone ?? '',
        first_name: user.first_name ?? '',
        last_name_1: user.last_name_1 ?? '',
        last_name_2: user.last_name_2 ?? '',
        birth_date: user.birth_date ?? '',
        fk_marital_status_id: user.fk_marital_status_id ?? '',
        personal_email: user.personal_email ?? '',
        cel_phone: user.cel_phone ?? '',
        curp: user.curp ?? '',
        rfc: user.rfc ?? '',
        imss: user.imss ?? '',
        infonavit: user.infonavit ?? '',
        emergency_name: user.emergency_name ?? '',
        fk_emergency_relationship_id: user.fk_emergency_relationship_id ?? '',
        emergency_phone: user.emergency_phone ?? '',
    }), []);

    const [formData, setFormData] = React.useState(() => getInitialFormData(user));
    const [loading, setLoading] = React.useState(false);
    const [formError, setFormError] = React.useState({});

    const [notificationProps, setNotificationProps] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });

    React.useEffect(() => {
        setFormData(getInitialFormData(user));
    }, [user, getInitialFormData]);

    const StyledAvatar = styled(Avatar)(() => ({
        borderRadius: "50%",
        border: `2px solid ${theme.palette.primary.main}`,
        height: isMediumScreen ? '35vw' : '10vw',
        width: isMediumScreen ? '35vw' : '10vw',
        margin: '0 auto',
    }));

    const handleChange = React.useCallback(({ target }) => {
        const { name, value } = target;
        setFormError(prev => ({ ...prev, [name]: false }));
        setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleValidation = React.useCallback(() => {
        const emptyFields = Object.keys(formData).filter(
            field => !formData[field]?.toString().trim()
        );

        if (emptyFields.length > 0) {
            setFormError(emptyFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}));
            handleNotification('error', 'Error: Completa todos los campos obligatorios');
            return false;
        }

        if (!/^\d{10}$/.test(formData.work_phone)) {
            handleNotification('error', 'Error: Teléfono de trabajo inválido');
            setFormError(prev => ({ ...prev, work_phone: true }));
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personal_email)) {
            handleNotification('error', 'Error: Correo personal inválido');
            setFormError(prev => ({ ...prev, personal_email: true }));
            return false;
        }

        if (!/^[A-Z0-9]{18}$/.test(formData.curp)) {
            handleNotification('error', 'Error: CURP inválida');
            setFormError(prev => ({ ...prev, curp: true }));
            return false;
        }

        if (!/^[A-Z0-9]{13}$/.test(formData.rfc)) {
            handleNotification('error', 'Error: RFC inválido');
            setFormError(prev => ({ ...prev, rfc: true }));
            return false;
        }

        if (!/^\d{11}$/.test(formData.imss)) {
            handleNotification('error', 'Error: Número de IMSS inválido');
            setFormError(prev => ({ ...prev, imss: true }));
            return false;
        }

        if (!/^\d{10}$/.test(formData.cel_phone)) {
            handleNotification('error', 'Error: Teléfono personal inválido');
            setFormError(prev => ({ ...prev, cel_phone: true }));
            return false;
        }

        return true;
    }, [formData, handleNotification]);

    const handleSubmit = React.useCallback(async (e) => {
        e.preventDefault();

        if (!handleValidation()) return;

        try {
            setLoading(true);

            const { ok, message } = await api.put(`user/${user.pk_user_id}`, formData);

            if (ok) {
                dispatch(update(formData));
                handleNotification('success', message);
            }

        } catch (error) {
            handleNotification('error', 'Error en la solicitud');
        } finally {
            setLoading(false);
        }
    }, [user.pk_user_id, formData, dispatch, handleValidation, handleNotification]);

    return (
        <GridLayout columnSpacing={0}>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary">EDITAR MI PERFIL</Typography>
                <Grid container spacing={2}>
                    {!isMediumScreen && <Grid size={2}></Grid>}
                    {!isMediumScreen &&
                        <Grid size={10} textAlign="left">
                            <Typography variant="body1" fontWeight="bold" color="primary" sx={{ mb: 1, }}>Cuenta</Typography>
                        </Grid>}
                    <Grid size={isMediumScreen ? 12 : 2} textAlign="center">
                        <StyledAvatar src={user.file ? `data:image/${user.file_extension};base64,${user.file}` : ''} />
                    </Grid>
                    {isMediumScreen &&
                        <Grid size={10} textAlign="left">
                            <Typography variant="body1" fontWeight="bold" color="primary">Cuenta</Typography>
                        </Grid>}
                    <Grid size={isMediumScreen ? 12 : 5} sx={{ mt: isMediumScreen ? 1 : '', }}>
                        <FormField label="*Usuario" value={user.username || ''} disabled />
                        <FormField label="*Teléfono de Trabajo" name="work_phone" value={formData.work_phone || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 10, } }} error={formError.work_phone} />
                        <FormField label="*Area" value={user.job_position_area || ''} sx={{ mt: 2, }} disabled />
                        <FormField label="*Oficina" value={user.job_position_office || ''} sx={{ mt: 2, }} disabled />
                    </Grid>
                    <Grid size={isMediumScreen ? 12 : 5}>
                        <FormField label="*Correo Electrónico Institucional" value={user.institutional_email || ''} disabled />
                        <FormField label="*Puesto" value={user.job_position || ''} sx={{ mt: 2, }} disabled />
                        <FormField label="*Departamento" value={user.job_position_department || ''} sx={{ mt: 2, }} disabled />
                        <FormField label="*Fecha de Ingreso" type="date" value={user.date_of_hire ? user.date_of_hire.split(' ')[0] : ''} sx={{ mt: 2, }} disabled />
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
                        <FormField name="first_name" label="*Nombre" value={formData.first_name || ''} onChange={handleChange} error={formError.first_name} />
                        <FormField name="last_name_2" label="*Apellido Materno" value={formData.last_name_2 || ''} sx={{ mt: 2, }} onChange={handleChange} error={formError.last_name_2} />
                        <Catalog
                            name="fk_marital_status_id"
                            apiEndpoint="catalog/user/marital_status/?available=1"
                            label="*Estado Civil"
                            value={formData.fk_marital_status_id}
                            onChange={handleChange}
                            className="mt-2" />
                        <FormField name="cel_phone" label="*Télefono personal" value={formData.cel_phone || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 10, } }} />
                        <FormField name="rfc" label="*RFC" value={formData.rfc || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 13, } }} />
                        <FormField name="infonavit" label="*Infonavit" value={formData.infonavit || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 10, } }} />
                        <Catalog
                            name="fk_emergency_relationship_id"
                            apiEndpoint="catalog/user/relationships/?available=1"
                            label="*Parentesco del Contacto de Emergencia"
                            value={formData.fk_emergency_relationship_id}
                            onChange={handleChange}
                            className="mt-2" />
                    </Grid>
                    <Grid size={isMediumScreen ? 12 : 5}>
                        <FormField name="last_name_1" label="*Apellido Paterno" value={formData.last_name_1 || ''} onChange={handleChange} error={formError.last_name_1} />
                        <FormField name="birth_date" label="*Fecha de Nacimiento" type="date" value={formData.birth_date || ''} sx={{ mt: 2, }} onChange={handleChange} disabled />
                        <FormField name="personal_email" label="*Correo Personal" value={formData.personal_email || ''} sx={{ mt: 2, }} onChange={handleChange} error={formError.personal_email} />
                        <FormField name="curp" label="*CURP" value={formData.curp || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 18, } }} error={formError.curp} />
                        <FormField name="imss" label="*IMSS" value={formData.imss || ''} sx={{ mt: 2, }} onChange={handleChange} slotProps={{ htmlInput: { maxLength: 11, } }} error={formError.imss} />
                        <FormField name="emergency_name" label="*Nombre de Contacto de Emergencia" value={formData.emergency_name || ''} sx={{ mt: 2, }} onChange={handleChange} error={formError.emergency_name} />
                        <FormField name="emergency_phone" label="*Número de Emergencia" value={formData.emergency_phone || ''} sx={{ mt: 2, }} onChange={handleChange} error={formError.emergency_phone} />
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