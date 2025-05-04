import React from 'react';
import { useNavigate } from 'react-router';
import {
    Grid2 as Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    useTheme,
    useMediaQuery,
    Chip,
    Pagination,
    styled,
    Backdrop,
    CircularProgress,
} from '@mui/material';
import GridLayout from '../../components/GridLayout/GridLayout';
import MenuMoreVert from '../../components/Menu/MoreVert';
import RoleButton from '../../components/RoleButton/RoleButton';
import SearchInput from '../../components/SearchInput/SearchInput';
import NoData from '../../components/Placeholders/NoData';
import { ROLES } from '../../assets/constants/constants';
import { formatDate } from '../../assets/utils/utils';
import api from '../../api/api';

const STATUS = {
    1: { label: 'Activo', color: 'success' },
    0: { label: 'Inactivo', color: 'default' },
};

const StylizedChip = styled(Chip)(({ theme }) => ({
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    width: '100%',
}));

const splitDataIntoChunks = (data, chunkSize = 10) => {
    let result = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        result.push(data.slice(i, i + chunkSize));
    }
    return result;
}

const UserList = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(true);
    const [users, setUsers] = React.useState([]);
    const [filteredUsers, setFilteredUsers] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [lastPage, setLastPage] = React.useState(1);

    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleCreate = React.useCallback(e => {
        e.preventDefault();
        navigate('crear');
    }, [navigate]);

    const handleEdit = React.useCallback((e, userid) => {
        e.preventDefault();
        navigate(`editar/${userid}`);
    }, [navigate]);

    const handleStatus = React.useCallback(async (e, id, status) => {
        e.preventDefault();
        try {
            const newStatus = status ? 0 : 1;
            const { ok } = await api.put('user/status', { id, status: newStatus, });
            if (ok) {
                setUsers(prevState => prevState && prevState.map(items => items && items.map(item => (
                    item.pk_user_id === id ? { ...item, is_active: newStatus } : item
                ))));
                setFilteredUsers(prevState => prevState && prevState.map(items => items && items.map(item => (
                    item.pk_user_id === id ? { ...item, is_active: newStatus } : item
                ))));
            }
        }
        catch (error) {
            console.log('Error al actualizar el estatus:', error);
        }
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { ok, users } = await api.get('users');
                if (ok) {
                    setUsers(splitDataIntoChunks(users));
                    setFilteredUsers(splitDataIntoChunks(users));
                }
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
        <GridLayout>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>GESTION DE USUARIOS</Typography>
                <SearchInput
                    data={users}
                    filters={{
                        full_name: 'NOMBRE',
                        username: 'USUARIO',
                        job_position: 'PUESTO',
                        job_position_area: 'ÁREA',
                        job_position_department: 'DEPARTAMENTO',
                        job_position_office: 'OFICINA',
                    }}
                    onFilter={setFilteredUsers}
                    onPage={setPage}
                    lastPage={lastPage}
                    placeholder="Nombre, Usuario, Puesto, Departamento, Oficina..."
                    sx={{ mt: 2, float: 'right', width: isMediumScreen ? '100%' : '33%', }}
                />
                <RoleButton
                    rolesAllowed={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}
                    sx={{ mt: 2, }}
                    onClick={handleCreate}
                    fullWidth={isMediumScreen}>Nuevo Usuario</RoleButton>
                {filteredUsers.length > 0 ?
                    <>
                        <TableContainer component={Paper} className="mt-1">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            <Typography variant="body1" fontWeight="bold" color="primary">NOMBRE</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1" fontWeight="bold" color="primary">USUARIO</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1" fontWeight="bold" color="primary">PUESTO</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1" fontWeight="bold" color="primary">ÁREA</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1" fontWeight="bold" color="primary">DEPARTAMENTO</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1" fontWeight="bold" color="primary">OFICINA</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1" fontWeight="bold" color="primary">FECHA DE CREACIÓN</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="body1" fontWeight="bold" color="primary">ÚLTIMO ACCESO</Typography>
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
                                    {filteredUsers[page - 1] && filteredUsers[page - 1].map((row, i) => (
                                        <TableRow key={row.pk_user_id}>
                                            <TableCell align="center">
                                                <Typography variant="body2" fontWeight="bold" color="primary">{row.full_name}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" fontWeight="bold" color="primary">{row.username}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" fontWeight="bold" color="primary">{row.job_position}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" fontWeight="bold" color="primary">{row.job_position_area}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" fontWeight="bold" color="primary">{row.job_position_department}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" fontWeight="bold" color="primary">{row.job_position_office}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" fontWeight="bold" color="primary">{formatDate(row.created_at)}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" fontWeight="bold" color="primary">{formatDate(row.last_access_at)}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <StylizedChip label={STATUS[row.is_active]?.label} color={STATUS[row.is_active]?.color} sx={{ width: '100%', }} />
                                            </TableCell>
                                            <TableCell align="center">
                                                <MenuMoreVert options={[
                                                    { label: 'Editar', onClick: (e) => handleEdit(e, row.pk_user_id), },
                                                    { label: Boolean(parseInt(row.is_active)) ? 'Desactivar' : 'Activar', onClick: (e) => handleStatus(e, row.pk_user_id, Boolean(parseInt(row.is_active))), title: !Boolean(parseInt(row.is_active)) ? '' : 'Se liberará además la vacante asociada al usuario.', },
                                                ]} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Pagination
                            count={(filteredUsers && filteredUsers.length) || 1}
                            color="primary"
                            page={page}
                            onChange={(e, page) => {
                                setPage(page);
                                setLastPage(page);
                            }}
                            sx={{ mt: 2, float: 'right', }} />
                    </>
                    :
                    <NoData />}
            </Grid>
        </GridLayout>
    )
};

export default UserList;