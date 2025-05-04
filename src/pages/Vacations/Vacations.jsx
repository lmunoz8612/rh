import React from 'react';
import GridLayout from '../../components/GridLayout/GridLayout';
import { Box, Button, Chip, Grid2 as Grid, Pagination, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from '@mui/material';

const StylizedBox = styled(Box)(({ theme }) => ({
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius * 2,
    height: '15vh',
    padding: theme.shape.padding,
    width: '100%',
}));

const StylizedIcon = styled('i')(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 'normal',
    fontSize: theme.typography.fontSize * 4,
    marginLeft: theme.shape.margin,
}));

const data = [
    { id: 1, code: 'SV-01', date: '02/05/2025 - 02/05/2025', auth: '15/01/2025 Luis Muñoz', approv: '15/01/2025 John Doe', status_id: 3, status: 'Finalizada', doc: 'Descargar' },
    { id: 2, code: 'SV-02', date: '02/05/2025 - 02/05/2025', auth: '15/01/2025 Luis Muñoz', approv: '15/01/2025 John Doe', status_id: 2, status: 'Autorizada', doc: 'Descargar' },
    { id: 3, code: 'SV-03', date: '02/05/2025 - 02/05/2025', auth: '15/01/2025 Luis Muñoz', approv: '15/01/2025 John Doe', status_id: 3, status: 'Finalizada', doc: 'Descargar' },
    { id: 4, code: 'SV-04', date: '02/05/2025 - 02/05/2025', auth: '15/01/2025 Luis Muñoz', approv: '15/01/2025 John Doe', status_id: 3, status: 'Finalizada', doc: 'Descargar' },
    { id: 5, code: 'SV-05', date: '02/05/2025 - 02/05/2025', auth: '15/01/2025 Luis Muñoz', approv: '15/01/2025 John Doe', status_id: 1, status: 'Solicitada', doc: 'Descargar' },
];

const STATUS_COLOR = {
    1: 'gray',
    2: 'warning',
    3: 'success',
};

const Vacations = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <GridLayout columnSpacing={2} maxHeight={true}>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary" className="mb-2">MIS VACACIONES</Typography>
                <Button variant="contained" color="primary" sx={{ borderRadius: 2 }} fullWidth={isSmallScreen ? true : false}>
                    <Typography variant="body2" color="white" title="Solicitud de vacaciones" noWrap>Solicitud de vacaciones</Typography>
                </Button>
                <Grid container spacing={2} className="mt-2">
                    <Grid size={isSmallScreen ? 12 : (12 / 5)}>
                        <StylizedBox>
                            <Typography component="span" variant="body1" color="primary" fontWeight="bold" title="Antigüedad" noWrap>Antigüedad</Typography>
                            <Typography component="div" variant="h2" color="primary" fontWeight="bold" textAlign="center" noWrap>
                                {1}
                                <Typography component="span" variant='body1' color="primary" fontWeight="bold">{'año'}</Typography>
                                <StylizedIcon className="ri-hourglass-line"></StylizedIcon>
                            </Typography>
                        </StylizedBox>
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : (12 / 5)}>
                        <StylizedBox>
                            <Typography component="span" variant="body1" color="primary" fontWeight="bold" title="Total de días" noWrap>Total de días</Typography>
                            <Typography component="div" variant="h2" color="primary" fontWeight="bold" textAlign="center" noWrap>
                                {12}
                                <StylizedIcon className="ri-umbrella-line"></StylizedIcon>
                            </Typography>
                        </StylizedBox>
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : (12 / 5)}>
                        <StylizedBox>
                            <Typography component="span" variant="body1" color="primary" fontWeight="bold" title="Días liberados" noWrap>Días liberados</Typography>
                            <Typography component="div" variant="h2" color="primary" fontWeight="bold" textAlign="center" noWrap>
                                {10}
                                <StylizedIcon className="ri-calendar-check-line"></StylizedIcon>
                            </Typography>
                        </StylizedBox>
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : (12 / 5)}>
                        <StylizedBox>
                            <Typography component="span" variant="body1" color="primary" fontWeight="bold" title="Vacaciones tomadas" noWrap>Vacaciones tomadas</Typography>
                            <Typography component="div" variant="h2" color="primary" fontWeight="bold" textAlign="center" noWrap>
                                {1}
                                <Typography component="span" variant='body1' color="primary" fontWeight="bold">{'días'}</Typography>
                                <StylizedIcon className="ri-flight-takeoff-line"></StylizedIcon>
                            </Typography>
                        </StylizedBox>
                    </Grid>
                    <Grid size={isSmallScreen ? 12 : (12 / 5)}>
                        <StylizedBox>
                            <Typography component="span" variant="body1" color="primary" fontWeight="bold" title="Vacaciones restantes" noWrap>Vacaciones restantes</Typography>
                            <Typography component="div" variant="h2" color="primary" fontWeight="bold" textAlign="center" noWrap>
                                {8}
                                <Typography component="span" variant='body1' color="primary" fontWeight="bold">{'días'}</Typography>
                                <StylizedIcon className="ri-time-line"></StylizedIcon>
                            </Typography>
                        </StylizedBox>
                    </Grid>
                    <Grid size={12}>
                        <TableContainer component={Paper} className="mt-1" sx={{ overflowX: 'auto' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary"># DE SOLICITUD</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">FECHA DE VACACIONES</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">AUTORIZACIÓN</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">APROBACIÓN</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">ESTATUS</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography component="span" variant="body1" fontWeight="bold" color="primary">DOCUMENTO</Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.code}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.date}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.auth}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.approv}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={row.status} color={STATUS_COLOR[row.status_id]} />
                                            </TableCell>
                                            <TableCell>
                                                <Typography component="span" variant="body2" fontWeight="bold" color="primary">{row.doc}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
                <Pagination count={5} color="primary" sx={{ mt: 2, float: 'right', }} />
            </Grid>
        </GridLayout>
    )
};

export default Vacations;