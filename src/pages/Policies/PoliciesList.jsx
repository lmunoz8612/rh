import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../context/Auth/Auth';
import GridLayout from '../../components/GridLayout/GridLayout';
import {
    Backdrop,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    FormGroup,
    Grid2 as Grid,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import Signature from '../../components/Signature/Signature';
import MenuMoreVert from '../../components/Menu/MoreVert';
import HorizontalTabs from '../../components/Tabs/Horizontal';
import RoleButton from '../../components/RoleButton/RoleButton';
import NoData from '../../components/Placeholders/NoData';
import Notification from '../../components/Notification/Notification';
import { ROLES } from '../../assets/constants/constants';
import { $, formatDate } from '../../assets/utils/utils';
import logo from '../../assets/imgs/logo.jpg';
import api from '../../api/api';

const StylizedImg = styled('img')(({ theme }) => ({
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
}));

const StylizedChip = styled(Chip)(({ theme }) => ({
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    width: '100%',
}));

const STATUS = {
    1: { label: 'Activa', color: 'success' },
    0: { label: 'Inactiva', color: 'default' },
};

const tabLabels = ['Políticas Asignadas', 'Políticas Empresa'];

const PoliciesList = () => {
    const user = useSelector((state) => state.user.data);
    const { role, has_signed_policies } = useAuth();
    const isReadOnly = has_signed_policies;
    const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    // Carga de mensaje de bienvenida
    const [loading, setLoading] = React.useState(true);
    const [openWelcomeDialog, setOpenWelcomeDialog] = React.useState(!has_signed_policies ? true : false);

    // Políticas asignadas al usuario.
    const [policies, setPolicies] = React.useState([]);

    // Política actual en visualización.
    const [currentPolicyTitle, setCurrentPolicyTitle] = React.useState(null);
    const [currentPolicyContent, setCurrentPolicyContent] = React.useState(null);

    // Flag para determinar si ya fue leída la política.
    const [policyIsRead, setPolicyIsRead] = React.useState(false);

    // Manejo de Pad para firma digital
    const [openSignaturePad, setOpenSignaturePad] = React.useState(false);
    const [signatureFile, setSignatureFile] = React.useState(null);
    const [signedOk, setSignedOk] = React.useState(false);

    const [error, setError] = React.useState('');
    const [notificationProps, setNotificationProps] = React.useState({ open: false, severity: 'success', message: '', });

    const [allOrgPolicies, setAllOrgPolicies] = React.useState([]);

    const handleCloseWelcomeDialog = React.useCallback(() => setOpenWelcomeDialog(false), []);

    const handleShowPolicy = React.useCallback((index) => {
        setPolicyIsRead(policies[index]?.isRead || false);
        setCurrentPolicyTitle(policies[index]?.policy);
        setCurrentPolicyContent(policies[index]?.content);
        if ($('content')) {
            $('content').scrollTop = 0;
        }
    }, [policies]);

    const handlePolicyIsRead = React.useCallback((policyName) => {
        setPolicyIsRead(true);
        setPolicies(prevPolicies => (
            prevPolicies.map(policy => (
                policy.policy === policyName ? { ...policy, isRead: true } : policy
            ))
        ));
    }, []);

    const handleSignatureAction = React.useCallback(() => {
        const isValid = policies.every(policy => policy.isRead);
        if (isValid) {
            setError('');
            setOpenSignaturePad(true);
        }
        else {
            setError('Es necesario leer todas las políticas antes de firmar.');
        }
    }, [policies]);

    const handleNotification = React.useCallback((severity, message, redirectTo = null) => {
        setNotificationProps({
            open: true,
            severity,
            message,
            redirectTo,
            duration: 6000,
        });
    }, []);

    const handleCloseSignaturePad = React.useCallback(async (fileBase64) => {
        if (!fileBase64 || typeof fileBase64 !== 'string') {
            setOpenSignaturePad(false);
            return;
        }

        setOpenSignaturePad(false);
        setSignatureFile(fileBase64);
        setSignedOk(true);

        try {
            // Procesar las políticas para el usuario.
            await Promise.all(policies.map(policy => (
                api.post('user_policies', {
                    fk_user_id: user.pk_user_id,
                    fk_policy_id: policy.pk_policy_id,
                    signing_date: new Date().toISOString(),
                    signature_file: fileBase64,
                })
            )));

            // Actualizar el estado de lectura de políticas del usuario
            await api.put('user_policies/status', {
                fk_user_id: user.pk_user_id,
                signed: 1,
            });

            handleNotification('success', 'Políticas firmadas exitosamente: ¡Ahora puede utilizar la plataforma VICA!',);
            setTimeout(() => { window.location.reload(); }, 3000);
        }
        catch (error) {
            console.error('Error:', error);
        }
    }, [policies, user, handleNotification]);

    const handleCreatePolicy = React.useCallback(e => {
        e.preventDefault();
        navigate('crear');
    }, [navigate]);

    const handleChangePolicyStatus = React.useCallback(async (e, rowIdx, id, status) => {
        e.preventDefault();
        try {
            const newStatus = status ? 0 : 1;
            const { ok } = await api.put('policies/status', { id, status: newStatus, });
            if (ok) {
                setAllOrgPolicies(prevData => prevData.map((item, idx) => idx === rowIdx ? { ...item, status: newStatus } : item));
            }
        }
        catch (error) {
            console.log('Ha ocurrido un error al actualizar el estatus:', error);
        }
    }, []);

    const handleEdit = React.useCallback((e, id) => {
        e.preventDefault();
        navigate(`editar/${id}`);
    }, [navigate]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { ok, data } = await api.get(`user_policies/?user_id=${user.pk_user_id}&signed=${parseInt(has_signed_policies)}`);
                if (ok && data.length > 0) {
                    setOpenWelcomeDialog(has_signed_policies ? false : true);
                    setPolicies(data);
                    setCurrentPolicyTitle(data[0]?.policy);
                    setCurrentPolicyContent(data[0]?.content);
                }

                if (isAdmin) {
                    const response = await api.get('policies');
                    if (response.ok) {
                        setAllOrgPolicies(response.data);
                    }
                }
            }
            catch (error) {
                console.error('Error al cargar la información: ', error);
            }
            finally {
                setLoading(false);
            }
        };
        if (user?.pk_user_id) {
            fetchData();
        }
    }, [user?.pk_user_id, has_signed_policies, isAdmin]);

    if (loading) return (<Backdrop open={loading} invisible><CircularProgress /></Backdrop>);

    return (
        <>
            <GridLayout columnSpacing={2} maxHeight>
                <Grid size={12}>
                    <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>
                        POLÍTICAS DE LA EMPRESA
                    </Typography>
                    <HorizontalTabs tabLabels={isAdmin ? tabLabels : ['Políticas Asignadas']} tabValues={[
                        (
                            policies.length > 0 ?
                                <Grid container columnSpacing={2}>
                                    {/* Lista de políticas */}
                                    {isMediumScreen &&
                                        <Grid size={12} border={1} padding={2} borderRadius={1}>
                                            {policies.map((policy, i) => (
                                                <FormGroup key={policy.pk_policy_id}>
                                                    <FormControlLabel
                                                        control={isReadOnly ?
                                                            <Checkbox checked={true} disabled />
                                                            :
                                                            <Checkbox checked={policy.isRead || false} disabled />
                                                        }
                                                        label={
                                                            <Typography variant="body2" color="primary" fontWeight="bold" sx={{ cursor: 'pointer' }} onClick={() => handleShowPolicy(i)}>
                                                                {policy.policy}
                                                            </Typography>
                                                        }
                                                    />
                                                </FormGroup>
                                            ))}
                                        </Grid>}

                                    {/* Sección de contenido de políticas */}
                                    <Grid id="content" size={isMediumScreen ? 12 : 9} border={1} padding={2} borderRadius={1} mt={isMediumScreen ? 2 : 0} sx={{ height: '60vh', overflowX: 'hidden' }}>
                                        <Typography variant="body1" color="primary" fontWeight="bold">
                                            {currentPolicyTitle}
                                        </Typography>
                                        <Typography component="div" variant="body2" color="primary" whiteSpace="pre-line" mt={2} dangerouslySetInnerHTML={{ __html: currentPolicyContent ? currentPolicyContent : '' }} />
                                        {currentPolicyContent && !isReadOnly && (
                                            <FormGroup sx={{ mt: 2 }}>
                                                <FormControlLabel
                                                    control={<Checkbox checked={policyIsRead} onChange={() => handlePolicyIsRead(currentPolicyTitle)} />}
                                                    label={
                                                        <Typography variant="body2" color="primary" fontWeight="bold">
                                                            He leído este reglamento y estoy de acuerdo
                                                        </Typography>
                                                    }
                                                />
                                            </FormGroup>
                                        )}
                                    </Grid>

                                    {/* Lista de políticas */}
                                    {!isMediumScreen &&
                                        <Grid size={3} border={1} padding={2} borderRadius={1}>
                                            {policies.map((policy, i) => (
                                                <FormGroup key={policy.pk_policy_id}>
                                                    <FormControlLabel
                                                        control={isReadOnly ?
                                                            <Checkbox checked={true} disabled />
                                                            :
                                                            <Checkbox checked={policy.isRead || false} disabled />
                                                        }
                                                        label={
                                                            <Typography variant="body2" color="primary" fontWeight="bold" sx={{ cursor: 'pointer' }} onClick={() => handleShowPolicy(i)}>
                                                                {policy.policy}
                                                            </Typography>
                                                        }
                                                    />
                                                </FormGroup>
                                            ))}
                                        </Grid>}

                                    {/* Firma */}
                                    <Grid size={9} textAlign="center" mt={2} ml={'auto'} mr={'auto'}>
                                        {isReadOnly ?
                                            <>
                                                <StylizedImg src={`data:image/png;base64,${policies[0]?.signature_file}`} alt="Firma" sx={{ width: isMediumScreen ? '100%' : 'auto', }} />
                                                <Typography variant="body2" color="primary" fontWeight="bold">
                                                    {user.full_name}
                                                </Typography>
                                            </>
                                            :
                                            signatureFile && (
                                                <>
                                                    <StylizedImg src={`data:image/png;base64,${signatureFile}`} alt="Firma" sx={{ width: isMediumScreen ? '100%' : 'auto', }} />
                                                    <Typography variant="body2" color="primary" fontWeight="bold">
                                                        {user.full_name}
                                                    </Typography>
                                                </>
                                            )
                                        }
                                    </Grid>

                                    {/* Botón de firmar */}
                                    {isReadOnly ?
                                        <Grid size={isMediumScreen ? 12 : 3} textAlign="center" mt={2}>
                                            <Button variant="contained" disabled={true}>Firmado</Button>
                                            <Typography variant="body2" color="primary" fontWeight="bold" mt={1}>
                                                {formatDate(policies[0]?.signing_date)}
                                            </Typography>
                                        </Grid>
                                        :
                                        <Grid size={isMediumScreen ? 12 : 3} textAlign="center" mt={2}>
                                            <Button variant="contained" onClick={handleSignatureAction} disabled={signedOk}>{signedOk ? 'Firmado' : 'Firmar'}</Button>
                                            {error && <Typography component="div" variant="caption" color="error" mt={1}>{error}</Typography>}
                                            {signedOk && (
                                                <Typography variant="body2" color="primary" fontWeight="bold" mt={1}>
                                                    {formatDate()}
                                                </Typography>
                                            )}
                                        </Grid>}
                                </Grid>
                                :
                                <NoData />
                        ),
                        (
                            isAdmin && (
                                <>
                                    <RoleButton
                                        rolesAllowed={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}
                                        onClick={handleCreatePolicy}
                                        fullWidth={isMediumScreen}>Nueva Política</RoleButton>
                                    {allOrgPolicies.length > 0 ?
                                        <TableContainer component={Paper} sx={{ mt: 1 }}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center">
                                                            <Typography variant="body1" fontWeight="bold" color="primary">POLÍTICA</Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Typography variant="body1" fontWeight="bold" color="primary">FECHA DE CREACIÓN</Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Typography variant="body1" fontWeight="bold" color="primary">CREADO POR</Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Typography variant="body1" fontWeight="bold" color="primary">FECHA DE EDICIÓN</Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Typography variant="body1" fontWeight="bold" color="primary">EDITADO POR</Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Typography variant="body1" fontWeight="bold" color="primary">ESTATUS</Typography>
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Typography variant="body1" fontWeight="bold" color="primary">ACCIONES</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {allOrgPolicies.map((row, i) => (
                                                        <TableRow key={row.pk_policy_id}>
                                                            <TableCell align="center">
                                                                <Link to={`${row.pk_policy_id}/ver-usuarios`}>
                                                                    <Typography variant="body2" fontWeight="bold" color="primary">{row.policy}</Typography>
                                                                </Link>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body2" fontWeight="bold" color="primary">{formatDate(row.created_at)}</Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body2" fontWeight="bold" color="primary">{row.created_by_full_name}</Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body2" fontWeight="bold" color="primary">{row.updated_by > 0 ? formatDate(row.updated_at) : '-'}</Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography variant="body2" fontWeight="bold" color="primary">{row.updated_by > 0 ? row.updated_by_full_name : '-'}</Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <StylizedChip label={STATUS[row.status]?.label} color={STATUS[row.status]?.color} sx={{ width: '100%', }} />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <MenuMoreVert options={[
                                                                    { label: 'Editar', onClick: (e) => { handleEdit(e, row.pk_policy_id) }, },
                                                                    { label: Boolean(parseInt(row.status)) ? 'Desactivar' : 'Activar', onClick: (e) => handleChangePolicyStatus(e, i, row.pk_policy_id, Boolean(parseInt(row.status))), },
                                                                ]} />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        :
                                        <NoData />}
                                </>
                            )
                        )
                    ]} defaultValue={0} />
                </Grid>
            </GridLayout>

            {/* Diálogo de notificación */}
            <Dialog open={openWelcomeDialog} onClose={handleCloseWelcomeDialog}>
                <img src={logo} className="mt-2" style={{ width: '30%', margin: 'auto' }} alt="logo" title='VxHR' />
                <DialogTitle>¡Bienvenid@ a VICA!</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" color="primary" mb={1}>
                        Tu aliado en la gestión de procesos de Recursos Humanos
                    </Typography>
                    <DialogContentText variant="body2" mb={1}>
                        Antes de comenzar, es necesario que revises y firmes las políticas de la compañía requeridas. Una vez
                        completado este paso, tendrás acceso a todas las funcionalidades que hemos diseñado para ti.
                    </DialogContentText>
                    <Typography variant="body1" color="primary" mb={1}>
                        ¡Nos alegra tenerte aquí!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseWelcomeDialog}>
                        Firmar políticas
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Diálogo de firma */}
            <Dialog open={openSignaturePad} onClose={handleCloseSignaturePad} fullWidth>
                <DialogContent>
                    <Signature onClose={handleCloseSignaturePad} />
                </DialogContent>
            </Dialog>

            <Notification
                {...notificationProps}
                onclose={() => setNotificationProps((prevState) => ({ ...prevState, open: false, }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} />
        </>
    );
};

export default PoliciesList;
