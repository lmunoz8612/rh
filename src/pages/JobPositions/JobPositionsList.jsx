import React from 'react';
import { useAuth } from '../../context/Auth/Auth';
import { useNavigate } from 'react-router';
import GridLayout from '../../components/GridLayout/GridLayout';
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
import RoleButton from '../../components/RoleButton/RoleButton';
import SearchInput from '../../components/SearchInput/SearchInput';
import MenuMoreVert from '../../components/Menu/MoreVert';
import NoData from '../../components/Placeholders/NoData';
import { ROLES } from '../../assets/constants/constants';
import { padWithZeros, formatDate } from '../../assets/utils/utils';
import api from '../../api/api';

const ADMIN_STATUS_COLOR = {
    1: 'primary',
    2: 'warning',
    3: 'secondary',
    4: 'success',
    5: 'gray',
};

const STATUS_COLOR = {
    1: 'success',
    2: 'error',
    3: 'default',
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

const JobPositionsList = () => {
    const { role } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = React.useState(true);
    const [data, setData] = React.useState([]);
    const [filteredData, setFilteredData] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [lastPage, setLastPage] = React.useState(1);

    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleCreate = React.useCallback(() => {
        navigate('crear');
    }, [navigate]);

    const handleEdit = React.useCallback((e, id) => {
        e.preventDefault();
        navigate(`editar/${id}`);
    }, [navigate]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { ok, data } = await api.get('job_positions');
                if (ok) {
                    setData(splitDataIntoChunks(data));
                    setFilteredData(splitDataIntoChunks(data));
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
        <GridLayout pagination={true}>
            <Grid size={12} height="auto">
                <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>{role <= ROLES.ADMIN ? 'ADMINISTRACIÓN DE VACANTES' : 'VACANTES'}</Typography>
                <SearchInput
                    data={data}
                    filters={{
                        job_position: 'NOMBRE',
                        job_position_area: 'ÁREA',
                        job_position_department: 'DEPARTAMENTO',
                        job_position_office: 'OFICINA',
                    }}
                    onFilter={setFilteredData}
                    onPage={setPage}
                    lastPage={lastPage}
                    placeholder="Nombre de Vacante, Área, Puesto, Departamento, Oficina..."
                    sx={{ mt: 2, float: 'right', width: isMediumScreen ? '100%' : '33%', }}
                />
                <RoleButton
                    rolesAllowed={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}
                    sx={{ mt: 2, }}
                    onClick={handleCreate}
                    fullWidth={isMediumScreen}>Nueva Vacante</RoleButton>
                {filteredData.length > 0 ?
                    <>
                        <TableContainer component={Paper} className="mt-1">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary"># DE VACANTE</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">NOMBRE DE VACANTE</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">AREA</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">DEPARTAMENTO</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">OFICINA</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">FECHA</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">{[ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role) ? 'POSTULACIÓN' : 'ESTATUS'}</Typography>
                                        </TableCell>
                                        {[ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role) &&
                                            <TableCell align="center">
                                                <Typography component="span" variant="body1" fontWeight="bold" color="primary">CREADO POR</Typography>
                                            </TableCell>}
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">ACCIONES</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData[page - 1] && filteredData[page - 1].map((row) => (
                                        <TableRow key={row.pk_job_position_id}>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">VC-#{padWithZeros(row.pk_job_position_id, 5)}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.job_position}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.job_position_area}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.job_position_department}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.job_position_office}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{formatDate(row.publish_date)}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                {[ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role) ?
                                                    <StylizedChip label={row.job_position_admin_status} color={ADMIN_STATUS_COLOR[row.fk_job_position_admin_status_id]} sx={{ bgcolor: row.fk_job_position_admin_status_id === 5 ? 'gray' : '' }} />
                                                    :
                                                    <StylizedChip label={row.job_position_status} color={STATUS_COLOR[row.fk_job_position_status_id]} />}
                                            </TableCell>
                                            {[ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role) &&
                                                <TableCell align="center">
                                                    <Typography component="span" variant="body2" fontWeight="bold" color={row.created_by === '0' ? 'textSecondary' : 'primary'}>{row.created_by === '0' ? 'PLATAFORMA' : row.created_by_full_name}</Typography>
                                                </TableCell>}
                                            <TableCell align="center">
                                                <MenuMoreVert options={
                                                    parseInt(row.job_position_status_id) === 1 ?
                                                        [
                                                            { label: 'Editar', onClick: (e) => handleEdit(e, row.pk_job_position_id), },
                                                            { label: 'Postularme a vacante', onClick: (e) => (1), disabled: true, },
                                                            { label: 'Recomendar a alguien', onClick: (e) => (1), disabled: true, },
                                                        ]
                                                        :
                                                        [
                                                            { label: 'Editar', onClick: (e) => handleEdit(e, row.pk_job_position_id), },
                                                        ]
                                                } />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Pagination
                            count={(filteredData && filteredData.length) || 1}
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

export default JobPositionsList;