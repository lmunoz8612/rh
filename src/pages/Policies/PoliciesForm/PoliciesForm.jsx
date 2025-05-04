import React from 'react';
import { useNavigate, useParams } from 'react-router';
import GridLayout from '../../../components/GridLayout/GridLayout';
import {
    Button,
    Grid2 as Grid,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import FormField from '../../../components/Forms/FormField/FormField';
import RoleButton from '../../../components/RoleButton/RoleButton';
import Catalog from '../../../components/Catalog/Catalog';
import Notification from '../../../components/Notification/Notification';
import TextEditorV2 from '../../../components/TextEditor/TextEditorV2';
import { ROLES } from '../../../assets/constants/constants';
import api from '../../../api/api';

const isFormInvalid = (formData) => (
    Object.entries(formData).some(([_, value]) => value === null || value === undefined || value === '')
);

const PoliciesForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        policy: '',
        nom_iso: '',
        fk_job_position_type_id: '',
        content: '',
    });
    const [filledData, setFilledData] = React.useState(false);
    const [notificationProps, setNotificationProps] = React.useState({ open: false, severity: 'success', message: '', });
    const [error, setError] = React.useState(false);

    const handleChange = React.useCallback(e => {
        const { name, value, } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
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

        const payload = formData;
        const method = id ? api.put : api.post;
        const endpoint = id ? `policies/${id}` : 'policies';

        try {
            setLoading(true);
            const { ok, message } = await method(endpoint, payload);
            if (ok) {
                handleNotification(ok ? 'success' : 'error', message, ok ? '/politicas-empresa' : '',);
            }
        }
        catch (error) {
            handleNotification('error', error.message);
        }
        finally {
            setLoading(false);
        }
    }, [id, formData, handleNotification]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { ok, data } = await api.get(`policies/?id=${id}`);
                if (ok) {
                    setFormData(data[0]);
                }
            }
            catch (error) {
                handleNotification('error', error.message);
            }
            finally {
                setFilledData(true);
                setLoading(false);
            }
        };
        if (id) {
            fetchData();
        }
    }, [id, handleNotification]);

    if (id && !filledData) return (<></>);

    return (
        <GridLayout>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>{id ? 'EDICIÓN DE' : 'NUEVA'} POLÍTICA</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField name="policy" label={'*Nombre'} value={formData.policy || ''} onChange={handleChange} error={error && !formData.policy ? true : false} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField name="nom_iso" label={'*Nomenclatura ISO'} value={formData.nom_iso || ''} onChange={handleChange} error={error && !formData.nom_iso ? true : false} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <Catalog name="fk_job_position_type_id" apiEndpoint={'catalog/job_position/type/?available=1'} label={'*Alcance'} value={formData.fk_job_position_type_id || ''} onChange={handleChange} error={error && !formData.fk_job_position_type_id ? true : false} />
                    </Grid>
                    <Grid size={12} className="mt-2">
                        <TextEditorV2 name="content" value={formData.content || ''} onChange={handleChange} />
                    </Grid>
                    <Grid size={12} className="mt-2">
                        <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent="flex-end" spacing={2}>
                            <Button type="button" variant="outlined" onClick={() => navigate('/politicas-empresa')} disabled={notificationProps.open || loading}>Cancelar</Button>
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
    )
};

export default PoliciesForm;