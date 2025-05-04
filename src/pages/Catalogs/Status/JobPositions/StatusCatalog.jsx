import React from 'react';
import GridLayout from '../../../../components/GridLayout/GridLayout';
import {
    Backdrop,
    Breadcrumbs,
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
    Typography
} from '@mui/material';
import { Link, } from 'react-router';
import NoData from '../../../../components/Placeholders/NoData';
import { formatDate, padWithZeros } from '../../../../assets/utils/utils';
import api from '../../../../api/api';

const STATUS = {
    1: { label: 'Activa', color: 'success' },
    0: { label: 'Inactiva', color: 'default' },
};

const StylizedChip = styled(Chip)(({ theme }) => ({
    color: theme.palette.common.white,
    width: '100%',
}));

const JobPositionStatusCatalog = () => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`catalog/job_position/admin_status`);
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

    if (loading) return(<Backdrop open={loading} invisible><CircularProgress /></Backdrop>);

    return (
        <GridLayout pagination={true}>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary" className="mb-2">CATÁLOGO DE ESTATUS DE VACANTES</Typography>
                <Breadcrumbs>
                    <Link to={'/catalogos'}><Typography variant="body2" color="primary">Estatus</Typography></Link>
                    <Typography variant="body2" color="textSecondary">Estatus de Vacantes</Typography>
                </Breadcrumbs>
                {data && data.length > 0 ?
                    <>
                        <TableContainer component={Paper} className="mt-1">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">ID</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">ESTATUS DE VACANTE</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">FECHA DE CREACIÓN</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">CREADO POR</Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">ESTATUS</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row, index) => (
                                        <TableRow key={'tr_' + index}>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">EVC-#{padWithZeros(row.pk_job_position_admin_status_id, 2)}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.job_position_admin_status}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{formatDate(new Date(row.created_at))}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography component="span" variant="body2" fontWeight="bold" color={row.created_by === '0' ? 'textSecondary' : 'primary'}>{row.created_by === '0' ? 'PLATAFORMA' : row.created_by_full_name}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <StylizedChip label={STATUS[row.status]?.label} color={STATUS[row.status]?.color} />
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

export default JobPositionStatusCatalog;