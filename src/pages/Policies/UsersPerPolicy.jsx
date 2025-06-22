import React from 'react';
import { Link, useParams } from 'react-router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
    Backdrop,
    Breadcrumbs,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid2 as Grid,
    Pagination,
    Paper,
    Stack,
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
import GridLayout from '../../components/GridLayout/GridLayout';
import MenuMoreVert from '../../components/Menu/MoreVert';
import { $, formatDate, padWithZeros } from '../../assets/utils/utils';
import logo from '../../assets/imgs/logo.jpg';
import api from '../../api/api';

const StylizedChip = styled(Chip)(({ theme }) => ({
    color: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
    width: '100%',
}));

const StylizedPolicyContainer = styled(Typography)(({ theme }) => ({
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    height: '100%',
    overflowY: 'auto',
    padding: theme.shape.padding,
    width: '100%',
    whiteSpace: 'pre-line',
}));

const StylizedImage = styled('img')(({ theme }) => ({
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    margin: 'auto',
}));

const STATUS = {
    1: { label: 'Firmada', color: 'success' },
    0: { label: 'Pendiente', color: 'default' },
};

const UsersPerPolicy = () => {
    const { id, } = useParams();
    const printReference = React.useRef();
    const [loading, setLoading] = React.useState(true);
    const [title, setTitle] = React.useState('');
    const [usersByPolicy, setUsersByPolicy] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [dialogProps, setDialogProps] = React.useState({
        open: false,
        title: '',
        content: '',
        file: '',
        user: '',
        date: '',
    });

    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleOpenDialog = React.useCallback((data) => {
        setDialogProps(prevProps => ({ ...prevProps, open: true, data: { ...data }, }));
    }, []);

    const handleCloseDialog = React.useCallback(() => {
        setDialogProps(prevProps => ({ ...prevProps, open: false }));
    }, []);

    const handleGeneratePDF = (documentName) => {
        $('print-icon').style.display = 'none';
        const dialog = printReference.current;

        const main = $('main');

        const content = $('dialog-content');
        const originalContentOverflow = content.style.overflow;
        content.style.overflow = 'visible';

        const contentText = $('dialog-content-text');
        const originalContentTextBorder = contentText.style.border;
        const originalContentTextPadding = contentText.style.padding;
        contentText.style.border = 0;
        contentText.style.padding = 0;

        html2canvas(main, {
            scale: 2,
            useCORS: true,
            windowWidth: dialog.scrollWidth,
            windowHeight: dialog.scrollHeight,
        })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'A4');
                const imgWidth = 210;
                const pageHeight = 297;
                const imgHeight = ((canvas.height * imgWidth) / canvas.width);

                let yPosition = 0;
                while (yPosition < imgHeight) {
                    if (yPosition > 0) {
                        pdf.addPage();
                    }
                    pdf.addImage(imgData, 'PNG', 0, -yPosition, imgWidth, imgHeight);
                    yPosition += pageHeight;
                }

                pdf.save(`${documentName}.pdf`);
            });

        content.style.overflow = originalContentOverflow;
        contentText.style.border = originalContentTextBorder;
        contentText.style.padding = originalContentTextPadding;
        $('print-icon').style.display = 'inline';
    };

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { ok, data } = await api.get(`policies/all_users_by_id/?id=${id}&page=${page}`);
                if (ok) {
                    setTitle(data[0]?.policy);
                    setUsersByPolicy(data);
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
    }, [id, page]);

    if (loading) return (<Backdrop open={loading} invisible><CircularProgress /></Backdrop>);

    return (
        <GridLayout>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary" mb={2}>{title && title.toUpperCase()}</Typography>
                <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center', }}>
                    {!isMediumScreen &&
                        <Breadcrumbs sx={{ width: '100%', }}>
                            <Link to={'/politicas-empresa'}>
                                <Typography variant="body2" color="primary">Politicas</Typography>
                            </Link>
                            <Typography variant="body2" color="textSecondary">{title}</Typography>
                        </Breadcrumbs>}
                </Stack>
                <TableContainer component={Paper} sx={{ mt: 1 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['NOMBRE', 'USUARIO', 'PUESTO', 'FECHA DE ASIGNACIÓN', 'ESTATUS', 'ACCIONES'].map((header) => (
                                    <TableCell key={header} align="center">
                                        <Typography variant="body1" fontWeight="bold" color="primary">
                                            {header}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usersByPolicy.map((row, i) => (
                                <TableRow key={i}>
                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight="bold" color="primary">{row.user_full_name}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight="bold" color="primary">{row.username}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight="bold" color="primary">{row.job_position}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight="bold" color="primary">{formatDate(row.created_at)}</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <StylizedChip label={STATUS[row.signing_date ? 1 : 0]?.label} color={STATUS[row.signing_date ? 1 : 0]?.color} sx={{ width: '100%', }} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <MenuMoreVert options={[
                                            {
                                                label: 'Ver Política',
                                                onClick: () => handleOpenDialog(row),
                                                disabled: !row.signing_date,
                                            },
                                        ]} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Pagination
                    count={(usersByPolicy[0] && parseInt(usersByPolicy[0]['total_pages'])) || 1}
                    color="primary"
                    page={page}
                    onChange={(e, page) => setPage(page)}
                    sx={{ mt: 2, float: 'right', }} />
            </Grid>
            <Dialog id="main" open={dialogProps.open} onClose={handleCloseDialog} slotProps={{
                paper: {
                    ref: printReference,
                    elevation: 0,
                    sx: { height: '100%', },
                }
            }}>
                <DialogTitle variant="h6" fontWeight="bold" color="primary">
                    <img src={logo} alt="" width="100%" />
                    <Typography variant="body1" color="primary" fontWeight="bold">
                        {dialogProps?.data?.policy.toUpperCase()}
                        <i id="print-icon" className="ri-printer-line" style={{ cursor: 'pointer', float: 'right' }} onClick={() => handleGeneratePDF(dialogProps?.data?.policy.toUpperCase())} title="Generar PDF"></i>
                    </Typography>
                    <Grid container mt={2}>
                        <Grid size={6}>
                            <Typography variant="body2" color="primary"><b>CÓDIGO:</b> VLP-{padWithZeros(dialogProps?.data?.pk_policy_id || 0, 4)}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="primary"><b>FECHA DE EMISIÓN:</b> {formatDate(dialogProps?.data?.created_at)}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="primary"><b>VERSIÓN:</b> 1</Typography>
                        </Grid>
                        <Grid size={6}>
                            <Typography variant="body2" color="primary"><b>FECHA DE REVISIÓN:</b> {formatDate(dialogProps?.data?.created_at)}</Typography>
                        </Grid>
                    </Grid>
                </DialogTitle>
                <DialogContent id="dialog-content">
                    <StylizedPolicyContainer id="dialog-content-text" component="div" variant="body2" dangerouslySetInnerHTML={{ __html: dialogProps?.data?.content + dialogProps?.data?.content }} />
                </DialogContent>
                <DialogActions>
                    <Stack direction="column" textAlign="center" margin="auto">
                        <StylizedImage src={`data:image/png;base64,${dialogProps?.data?.signature_file}`} alt="Firma" />
                        <Typography variant="body2" color="primary" fontWeight="bold" mt={1}>
                            {dialogProps?.data?.user_full_name}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">{formatDate(dialogProps?.data?.signing_date)}</Typography>
                    </Stack>
                </DialogActions>
            </Dialog>
        </GridLayout>
    )
};

export default UsersPerPolicy;