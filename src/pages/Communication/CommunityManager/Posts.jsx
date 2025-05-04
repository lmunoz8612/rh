import React from 'react';
import GridLayout from '../../../components/GridLayout/GridLayout';
import {
    Backdrop,
    Chip,
    CircularProgress,
    Grid2 as Grid,
    Pagination,
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
    useTheme
} from '@mui/material';
import { useNavigate, } from 'react-router';
import MenuMoreVert from '../../../components/Menu/MoreVert';
import NoData from '../../../components/Placeholders/NoData';
import RoleButton from '../../../components/RoleButton/RoleButton';
import { ROLES } from '../../../assets/constants/constants';
import { formatDate, } from '../../../assets/utils/utils';
import api from '../../../api/api';

const STATUS = {
    1: { label: 'Activa', color: 'success' },
    0: { label: 'Inactiva', color: 'default' },
};

const StylizedChip = styled(Chip)(({ theme }) => ({
    color: theme.palette.common.white,
    width: '100%',
}));

const CommunityManagerPosts = () => {
    const navigate = useNavigate();

    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleNewItem = React.useCallback(e => {
        e.preventDefault();
        navigate('crear');
    }, [navigate]);

    const handleEditItem = React.useCallback((e, id) => {
        e.preventDefault();
        navigate(`editar/${id}`);
    }, [navigate]);

    const handleStatus = React.useCallback(async (e, rowIdx, pk_post_id, status) => {
        e.preventDefault();
        try {
            const newStatus = status ? 0 : 1;
            const { ok } = await api.put('communication/post_status', { pk_post_id, status: newStatus, });
            if (ok) {
                setData(prevData => prevData.map((item, idx) => idx === rowIdx ? { ...item, status: newStatus } : item));
            }
        }
        catch (error) {
            console.log('Error al actualizar el estatus:', error);
        }
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('communication/posts');
                setData(response.data);
            }
            catch (error) {
                console.log('Error al cargar la información: ', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (<Backdrop open={loading} invisible><CircularProgress /></Backdrop>);

    return (
        <GridLayout pagination={true}>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary" className="mb-2">PUBLICACIONES</Typography>
                <RoleButton
                    rolesAllowed={[ROLES.SUPER_ADMIN, ROLES.COMMUNITY_MANAGER]}
                    sx={{ mt: 2, }}
                    onClick={handleNewItem}
                    fullWidth={isSmallScreen}>Nueva Publicación</RoleButton>
                {data && data.length > 0 ?
                    <>
                        <TableContainer component={Paper} className="mt-1">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">TÍTULO</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">FECHA DE PUBLICACIÓN</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">TIPO</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">CREADO POR</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">ESTATUS</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">ACCIONES</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row, index) => (
                                        <TableRow key={'tr_' + index}>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.title}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{formatDate(new Date(row.publish_date))}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.post_type}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color={row.created_by === '0' ? 'textSecondary' : 'primary'}>{row.created_by === '0' ? 'PLATAFORMA' : row.created_by_full_name}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <StylizedChip label={STATUS[row.status]?.label} color={STATUS[row.status]?.color} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <MenuMoreVert options={[
                                                    { label: 'Editar', onClick: (e) => handleEditItem(e, row.pk_post_id), },
                                                    { label: Boolean(parseInt(row.status)) ? 'Desactivar' : 'Activar', onClick: (e) => handleStatus(e, index, row.pk_post_id, Boolean(parseInt(row.status))), },
                                                ]} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Pagination count={1} color="primary" sx={{ mt: 2, float: 'right', }} />
                    </>
                    :
                    <NoData />}
            </Grid>
        </GridLayout>
    )
};

export default CommunityManagerPosts;