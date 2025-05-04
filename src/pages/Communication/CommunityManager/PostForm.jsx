import React from 'react';
import { Link, useNavigate, useParams, } from 'react-router';
import GridLayout from '../../../components/GridLayout/GridLayout';
import {
    Breadcrumbs,
    Button,
    Grid2 as Grid,
    InputAdornment,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import FormField from '../../../components/Forms/FormField/FormField';
import Select from '../../../components/Select/Select';
import RoleButton from '../../../components/RoleButton/RoleButton';
import Notification from '../../../components/Notification/Notification';
import TextEditorV2 from '../../../components/TextEditor/TextEditorV2';
import { ROLES } from '../../../assets/constants/constants';
import api from '../../../api/api';
import { Clear } from '@mui/icons-material';

const isFormInvalid = (formData) => (
    Object.entries(formData).filter(([key]) => key !== 'file').some(([_, value]) => value === null || value === undefined || value === '')
);

const CommunityManagerPostForm = () => {
    const { id, } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(false);
    const [postTypes, setPostTypes] = React.useState([]);
    const [publishDateLabel, setPublishDateLabel] = React.useState('publicación');
    const [formData, setFormData] = React.useState({
        fk_post_type_id: '',
        publish_date: '',
        title: '',
        content: '',
    });
    const [postFile, setPostFile] = React.useState('');
    const [filledData, setFilledData] = React.useState(false);
    const [notificationProps, setNotificationProps] = React.useState({
        open: false,
        severity: 'success',
        message: '',
    });
    const [error, setError] = React.useState(false);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChange = React.useCallback(e => {
        if (e.target.name === 'file') {
            setPostFile(e.target.files[0]);
        }
        else {
            setPublishDateLabel((e.target.name === 'fk_post_type_id' && parseInt(e.target.value) === 2) ? 'Evento' : 'Publicación');
            setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.value, }));
        }
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
            handleNotification('error', 'Favor de completar toda la información de alta de usuario.');
            return;
        }

        const method = id ? api.put : api.post;
        const endpoint = id ? `communication/post/${id}` : 'communication/post';
        const { ok, last_insert_id, message } = await method(endpoint, formData);
        try {
            if (ok) {
                if (postFile && postFile instanceof File) {
                    const document = new FormData();
                    document.append('pk_post_id', id ? id : last_insert_id);
                    document.append('post_file', postFile);
                    try {
                        await api.post('communication/post_file', document, true);
                        handleNotification('success', message, '/creacion-contenido');
                    }
                    catch (error) {
                        handleNotification('error', 'Error: Falló la carga de imagen de publicación', null);
                    }
                }
                else {
                    handleNotification('success', message, '/creacion-contenido');
                }
            }
            else {
                setError(true);
                handleNotification('error', message, null);
            }
        }
        catch (error) {
            handleNotification('error', error.message);
        }
        finally {
            setLoading(false);
        }
    }, [id, formData, postFile, handleNotification]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const responsePostTypes = await api.get('communication/post_types');
                if (responsePostTypes.ok) {
                    setPostTypes(responsePostTypes.data);
                }

                if (id) {
                    const responsePost = await api.get(`communication/post/?id=${id}`);
                    if (responsePost.ok) {
                        const post = responsePost.data;
                        setFormData(prevData => ({ ...prevData, fk_post_type_id: post?.fk_post_type_id, publish_date: post?.publish_date.split(' ')[0], title: post?.title, content: post?.content, }));
                    }
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

        fetchData();
    }, [id, handleNotification]);

    if (id && !filledData) return (<></>);

    return (
        <GridLayout>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary">{id ? 'EDITAR' : 'NUEVA'} PUBLICACIÓN</Typography>
                <Breadcrumbs className="mt-2">
                    <Link to={'/creacion-contenido'}>
                        <Typography variant="body2" color="primary">Creación de Contenido</Typography>
                    </Link>
                    <Typography variant="body2" color="textSecondary">{id ? 'Editar' : 'Nueva'} Publicación</Typography>
                </Breadcrumbs>
                <form onSubmit={handleSubmit}>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <Select name="fk_post_type_id" label="*Tipo" value={formData.fk_post_type_id || ''} onChange={handleChange} options={
                            postTypes.map(postType => ({
                                label: postType.post_type,
                                value: postType.pk_post_type_id,
                            }))
                        } error={error && !formData.fk_post_type_id ? true : false} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField name="publish_date" type="date" label={`*Fecha de ${publishDateLabel}`} value={formData.publish_date || ''} onChange={handleChange}
                            slotProps={{
                                htmlInput: {
                                    min: new Date().toISOString().split('T')[0],
                                }
                            }}
                            error={error && !formData.publish_date ? true : false} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField name="title" label={'*Título'} value={formData.title || ''} onChange={handleChange} slotProps={{
                            htmlInput: {
                                maxLength: 100,
                            }
                        }} error={error && !formData.title ? true : false} />
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : 6} className="mt-2">
                        <FormField name="file" label={'*Imagen'} type="file" onChange={handleChange} slotProps={{
                            input: {
                                endAdornment: <InputAdornment><Clear /></InputAdornment>
                            },
                            htmlInput: {
                                accept: 'image/*',
                            }
                        }}
                        error={error && !formData.file ? true : false} />
                    </Grid>
                    <Grid size={12} className="mt-2">
                        <TextEditorV2 name="content" value={formData.content || ''} onChange={handleChange} />
                    </Grid>
                    <Grid size={12} className="mt-2">
                        <Stack direction={isSmallScreen ? 'column' : 'row'} justifyContent="flex-end" spacing={2}>
                            <Button type="button" variant="outlined" onClick={() => navigate('/creacion-contenido')} disabled={notificationProps.open || loading}>Cancelar</Button>
                            <RoleButton type="submit" loading={loading} rolesAllowed={[ROLES.SUPER_ADMIN, ROLES.COMMUNITY_MANAGER]} disabled={notificationProps.open || loading}>Guardar</RoleButton>
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

export default CommunityManagerPostForm;
