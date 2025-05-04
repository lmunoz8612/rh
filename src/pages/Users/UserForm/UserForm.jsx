import React from 'react';
import { useNavigate, useParams } from 'react-router';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Grid2 as Grid,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { KeyboardArrowDown } from '@mui/icons-material';
import FormField from '../../../components/Forms/FormField/FormField';
import Catalog from '../../../components/Catalog/Catalog';
import GridLayout from '../../../components/GridLayout/GridLayout';
import RoleButton from '../../../components/RoleButton/RoleButton';
import Notification from '../../../components/Notification/Notification';
import { ROLES } from '../../../assets/constants/constants';
import { padWithZeros } from '../../../assets/utils/utils';
import api from '../../../api/api';

const form = [
    {
        title: 'Datos Personales',
        fields: [
            { field: 'first_name', label: '*Nombre(s)', length: 100, },
            { field: 'last_name_1', label: '*Apellido Paterno', length: 100, },
            { field: 'last_name_2', label: '*Apellido Materno', length: 100, },
            { field: 'birth_date', label: '*Fecha de Nacimiento', type: 'date', },
            { field: 'curp', label: '*CURP', uppercase: true, length: 18, },
            { field: 'rfc', label: '*RFC', uppercase: true, length: 13, },
            { field: 'imss', label: '*IMSS', length: 11, },
            { field: 'infonavit', label: 'INFONAVIT', length: 10, },
            { field: 'fk_gender_id', label: '*Género', is_catalog: true, endpoint: 'catalog/user/genders/?available=1', },
            { field: 'fk_marital_status_id', label: '*Estado Civil', is_catalog: true, endpoint: 'catalog/user/marital_status/?available=1', },
            { field: 'fk_nationality_id', label: '*Nacionalidad', is_catalog: true, endpoint: 'catalog/user/nationalities/?available=1', },
            { field: 'profile_picture', label: 'Fotografía de Perfil', type: 'file', accept: 'image/*' },
        ],
    },
    {
        title: 'Contacto y Domicilio',
        fields: [
            { field: 'cel_phone', label: '*Teléfono Celular', length: 10, },
            { field: 'phone', label: 'Teléfono Fijo (Opcional)', length: 10, },
            { field: 'personal_email', label: '*Correo Electrónico Personal', length: 150, },
            { field: 'zip_code', label: '*Código Postal', length: 5, },
            { field: 'fk_country_id', label: '*País', is_catalog: true, endpoint: 'catalog/default/countries/?available=1', },
            { field: 'fk_state_id', label: '*Estado', is_catalog: true, endpoint: 'catalog/default/states/?available=1', parent_id: 'fk_country_id', },
            { field: 'city_name', label: '*Ciudad', length: 150, },
            { field: 'district', label: '*Colonia', length: 150, },
            { field: 'street', label: '*Calle', length: 150, },
            { field: 'ext_number', label: '*Número Exterior', length: 10, },
            { field: 'int_number', label: 'Número Interior', length: 10, },
        ],
    },
    {
        title: 'Contacto de Emergencia',
        fields: [
            { field: 'emergency_name', label: '*Nombre del Contacto de Emergencia', length: 100, },
            { field: 'emergency_phone', label: '*Teléfono del Contacto de Emergencia', length: 10, },
            { field: 'emergency_email', label: '*Correo electrónico del Contacto de Emergencia', length: 150, },
            { field: 'fk_emergency_relationship_id', label: '*Parentesco', is_catalog: true, endpoint: 'catalog/user/relationships/?available=1', },
        ],
    },
    {
        title: 'Información Laboral',
        fields: [
            { field: 'institutional_email', label: '*Correo Electrónico Institucional', length: 150, },
            { field: 'fk_job_position_id', label: '*Puesto', is_catalog: true, endpoint: 'job_position/positions/?available=1', },
            { field: 'date_of_hire', label: '*Fecha de Ingreso', type: 'date', },
            { field: 'work_phone', label: 'Teléfono de Oficina', length: 10, },
        ],
    },
    {
        title: 'Datos de Cuenta',
        fields: [
            { field: 'role_id', label: '*Tipo de usuario', is_catalog: true, endpoint: 'catalog/user/roles/?available=1', },
            { field: 'username', label: '*Usuario', length: 100, },
            { field: 'password', type: 'password', label: '*Contraseña', length: 32, },
        ],
    },
];

const isFormInvalid = (formData) => (
    Object.entries(formData)
        .filter(([key]) =>
            key !== 'phone' &&
            key !== 'int_number' &&
            key !== 'infonavit' &&
            key !== 'profile_picture' &&
            key !== 'fk_job_position_id' &&
            key !== 'fk_job_position_id' &&
            key !== 'work_phone'
        )
        .some(([_, value]) => value === null || value === undefined || value === '')
);

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
    const [user, setUser] = React.useState({});
    const [formData, setFormData] = React.useState({});
    const [profilePicture, setProfilePicture] = React.useState(null);
    const [fillData, setFillData] = React.useState(false);
    const [notificationProps, setNotificationProps] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const [error, setError] = React.useState(false);
    const [errorType, setErrorType] = React.useState('');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = React.useCallback(e => {
        const { name, value } = e.target;
        const formattedValue = (name === 'curp' || name === 'rfc') ? value.toUpperCase() : value;

        if (name === 'profile_picture') {
            setProfilePicture(e.target.files[0]);
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: formattedValue,
            ...(name === 'fk_country_id' && { fk_state_id: '', }),
        }));
    }, [setFormData]);

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
            handleNotification('error', 'Favor de completar toda la información de alta de usuario.');
            return;
        }

        try {
            setError(false);
            setErrorType('');
            setLoading(true);

            const method = id ? api.put : api.post;
            const endpoint = id ? `user/${id}` : 'user';
            const { ok, type, new_user_id, message } = await method(endpoint, formData);
            if (ok) {
                if (profilePicture && profilePicture instanceof File) {
                    const document = new FormData();
                    document.append('user_id', id ? id : new_user_id);
                    document.append('type_file', 1);
                    document.append('profile_picture', profilePicture);

                    try {
                        await api.post('user_files', document, true);
                        handleNotification('success', message, '/usuarios');
                    }
                    catch (error) {
                        handleNotification('error', 'Error: Falló la carga de fotografía de perfil', null);
                    }
                }
                else {
                    handleNotification('success', message, '/usuarios');
                }
            }
            else {
                setError(true);
                setErrorType(type);
                handleNotification('error', message, null);
            }
        }
        catch (error) {
            handleNotification('error', `Error en la solicitud: ${error}`, null);
        }
        finally {
            setLoading(false);
        }
    }, [id, formData, profilePicture, handleNotification]);

    React.useEffect(() => {
        const fetchData = async () => {
            const initialFormData = form.reduce((accumulator, section) => {
                section.fields.forEach(({ field }) => {
                    accumulator[field] = (id && field === 'password') ? '********' : '';
                });
                return accumulator;
            }, {});

            setFormData(initialFormData);
            if (id) {
                try {
                    setLoading(true);
                    const { ok, user } = await api.get(`user/?id=${id}`);
                    if (ok) {
                        setUser(user);
                        setFormData(prevData => ({
                            ...prevData,
                            ...Object.keys(user).reduce((accumulated, key) => (
                                key in prevData ? { ...accumulated, [key]: user[key] } : accumulated
                            ), {})
                        }));
                    }
                }
                catch (error) {
                    console.log(error);
                }
                finally {
                    setFillData(true);
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [id]);

    if (id && !fillData) return (<></>);

    return (
        <GridLayout>
            <Grid size={12}>
                <form method='POST' encType='multipart/form-data' onSubmit={handleSubmit}>
                    <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>{id ? 'EDICIÓN' : 'ALTA'} DE USUARIO</Typography>
                    {form.map(({ title, fields }) => (
                        <Accordion key={title} sx={{ width: "100%" }} disableGutters>
                            <AccordionSummary expandIcon={<KeyboardArrowDown />}>
                                <Typography variant="body1" fontWeight="bold" color="primary">{title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container columnSpacing={isSmallScreen ? 0 : 3}>
                                    {fields.map(({ field, type, accept, label, is_catalog, endpoint, parent_id, length, }, f_idx) => (
                                        <Grid key={f_idx} size={isSmallScreen ? 12 : 6}>
                                            {is_catalog ?
                                                <Catalog
                                                    key={f_idx}
                                                    name={field}
                                                    apiEndpoint={endpoint}
                                                    label={label}
                                                    value={formData[field] ? formData[field] : ''}
                                                    onChange={handleChange}
                                                    parentId={formData[parent_id]}
                                                    extraOption={
                                                        (field === 'fk_job_position_id' && id && user.fk_job_position_id) ?
                                                            {id: user.fk_job_position_id, description: 'VC-#' + padWithZeros(user.fk_job_position_id, 5) + ' - ' + user.job_position}
                                                            :
                                                            ''
                                                    }
                                                    className="mt-2"
                                                    error={error && !formData[field] ? true : false} />
                                                :
                                                field === 'profile_picture' ?
                                                    <FormField
                                                        key={f_idx}
                                                        name={field}
                                                        type={type}
                                                        label={label}
                                                        className="mt-2"
                                                        onChange={handleChange}
                                                        slotProps={{
                                                            htmlInput: {
                                                                accept,
                                                            }
                                                        }} />
                                                    :
                                                    <FormField
                                                        key={f_idx}
                                                        name={field}
                                                        type={type}
                                                        label={label}
                                                        value={formData[field] || ''}
                                                        className="mt-2"
                                                        onChange={handleChange}
                                                        slotProps={{
                                                            htmlInput: {
                                                                maxLength: length,
                                                            }
                                                        }}
                                                        error={error && (field !== 'phone' && field !== 'infonavit' && field !== 'int_number') && (!formData[field] || errorType === field) ? true : false} />}
                                        </Grid>
                                    ))}
                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                    <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent="flex-end" mt={2} spacing={2}>
                        <Button type="button" variant="outlined" disabled={notificationProps.open || loading} onClick={() => navigate('/usuarios')}>Cancelar</Button>
                        <RoleButton type="submit" loading={loading} rolesAllowed={[ROLES.SUPER_ADMIN, ROLES.ADMIN]} disabled={notificationProps.open || loading}>{id ? 'Editar Usuario' : 'Crear Usuario'}</RoleButton>
                    </Stack>
                </form>
            </Grid>
            <Notification
                {...notificationProps}
                onclose={() => setNotificationProps((prevState) => ({ ...prevState, open: false, }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} />
        </GridLayout>
    );
};

export default UserForm;