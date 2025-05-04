import React from 'react';
import { useAuth } from '../../context/Auth/Auth';
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
    Avatar,
    Pagination,
    useTheme,
    useMediaQuery,
    Backdrop,
    CircularProgress
} from '@mui/material';
import GridLayout from '../../components/GridLayout/GridLayout';
import SearchInput from '../../components/SearchInput/SearchInput';
import NoData from '../../components/Placeholders/NoData';
import { ROLES } from '../../assets/constants/constants';
import api from '../../api/api';

const splitDataIntoChunks = (data, chunkSize = 10) => {
    let result = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        result.push(data.slice(i, i + chunkSize));
    }
    return result;
}

const Directory = () => {
    const { role, } = useAuth()
    const [users, setUsers] = React.useState([]);
    const [filteredUsers, setFilteredUsers] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [lastPage, setLastPage] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role);

    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

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
                <Typography variant="h6" fontWeight="bold" color="primary" className="mb-2">DIRECTORIO</Typography>
                <SearchInput
                    data={users}
                    filters={{
                        full_name: 'NOMBRE',
                        job_position: 'PUESTO',
                        job_position_area: 'ÁREA',
                        job_position_department: 'DEPARTAMENTO',
                        job_position_office: 'OFICINA',
                        institutional_email: 'CORREO',
                    }}
                    onFilter={setFilteredUsers}
                    onPage={setPage}
                    lastPage={lastPage}
                    placeholder="Nombre, Puesto, Departamento, Oficina, Correo Electrónico..."
                    sx={{ mt: 2, float: 'right', width: isMediumScreen ? '100%' : '33%', }}
                />
                {filteredUsers.length > 0 ?
                    <>
                        <TableContainer component={Paper} className="mt-1" sx={{ overflowX: 'auto' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center"></TableCell>
                                        <TableCell align="center"><Typography variant="body1" fontWeight="bold" color="primary">NOMBRE</Typography></TableCell>
                                        <TableCell align="center"><Typography variant="body1" fontWeight="bold" color="primary">PUESTO</Typography></TableCell>
                                        <TableCell align="center"><Typography variant="body1" fontWeight="bold" color="primary">ÁREA</Typography></TableCell>
                                        <TableCell align="center"><Typography variant="body1" fontWeight="bold" color="primary">DEPARTAMENTO</Typography></TableCell>
                                        <TableCell align="center"><Typography variant="body1" fontWeight="bold" color="primary">OFICINA</Typography></TableCell>
                                        <TableCell align="center"><Typography variant="body1" fontWeight="bold" color="primary">DATOS DE CONTACTO</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredUsers[page - 1] && filteredUsers[page - 1].map((row) => (
                                        <TableRow key={row.pk_user_id}>
                                            <TableCell align="center"><Avatar src={row.profile_picture} sx={{ bgcolor: row.bgcolor }}></Avatar></TableCell>
                                            <TableCell align="center"><Typography variant="body2" fontWeight="bold" color="primary">{row.full_name}</Typography></TableCell>
                                            <TableCell align="center"><Typography variant="body2" fontWeight="bold" color="primary">{row.job_position}</Typography></TableCell>
                                            <TableCell align="center"><Typography variant="body2" fontWeight="bold" color="primary">{row.job_position_area}</Typography></TableCell>
                                            <TableCell align="center"><Typography variant="body2" fontWeight="bold" color="primary">{row.job_position_department}</Typography></TableCell>
                                            <TableCell align="center"><Typography variant="body2" fontWeight="bold" color="primary">{row.job_position_office}</Typography></TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" fontWeight="bold" color="primary">
                                                    {row.institutional_email}
                                                    <br />
                                                    {isAdmin && row.work_phone}
                                                </Typography>
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

export default Directory;