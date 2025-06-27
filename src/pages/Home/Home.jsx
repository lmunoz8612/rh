import React from 'react';
import { useSelector } from 'react-redux';
import {
    Avatar,
    Backdrop,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Grid2 as Grid,
    Paper,
    Stack,
    styled,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import Weather from '../../components/Weather/Weather';
import notImage from '../../assets/imgs/placeholders/notImage.jpg';
import WereCaughtUp from '../../components/Placeholders/WereCaughtUp';
import { $ } from '../../assets/utils/utils';
import api from '../../api/api';
import { Link } from 'react-router';

const StylizedIcon = styled('i')(({ theme }) => ({
    color: theme.palette.primary.main,
    fontWeight: 'normal',
}));

const StylizedLink = styled(Link)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

const StylizedPreviewContent = styled(Typography)(() => ({
    width: '100%',
    height: '89%',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 5,
}));

const REACTIONS_COLORS = {
    'default': 'grey',
    'like': 'blue',
    'love': 'red',
};

const Home = () => {
    const user = useSelector(state => state.user.data);
    const theme = useTheme();
    const isMdDownScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [loading, setLoading] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [dashboard, setDashboard] = React.useState([]);
    const [birthdayDialogProps, setBirthdayDialogProps] = React.useState({
        pk_birthday_id: '',
        all_comments: [],
        new_comment: '',
    });

    const handleOpen = React.useCallback(() => {
        setOpen(true);
    }, []);

    const handleClose = React.useCallback(() => {
        setOpen(false);
    }, []);

    const handleReaction = React.useCallback(async (pk_birthday_id, reactionType) => {
        let total_reactions = 0;
        if ($(`${reactionType}_${pk_birthday_id}`).style.color !== REACTIONS_COLORS['default']) {
            const responseRemoveBirthdayReaction = await api.post('communication/remove_birthday_reaction', {
                fk_birthday_id: pk_birthday_id,
                fk_user_id: user.pk_user_id,
            });
            if (responseRemoveBirthdayReaction.ok) {
                $(`${reactionType}_${pk_birthday_id}`).style.color = REACTIONS_COLORS['default'];
                total_reactions = responseRemoveBirthdayReaction.total_reactions;
            }
        }
        else {
            const responseAddBirthdayReaction = await api.post('communication/birthday_reaction', {
                fk_birthday_id: pk_birthday_id,
                fk_user_id: user.pk_user_id,
                reaction_type: reactionType,
            });
            if (responseAddBirthdayReaction.ok) {
                if (reactionType === 'like') {
                    $(`like_${pk_birthday_id}`).style.color = REACTIONS_COLORS['like'];
                    $(`love_${pk_birthday_id}`).style.color = REACTIONS_COLORS['default'];
                }
                else if (reactionType === 'love') {
                    $(`like_${pk_birthday_id}`).style.color = REACTIONS_COLORS['default'];
                    $(`love_${pk_birthday_id}`).style.color = REACTIONS_COLORS['love'];
                }
                total_reactions = responseAddBirthdayReaction.total_reactions;
            }
        }

        setDashboard(prevState => ({
            ...prevState,
            birthdays: prevState.birthdays.map(birthday => (
                birthday.pk_birthday_id === pk_birthday_id ? { ...birthday, count_reactions: total_reactions, } : birthday
            )),
        }));
    }, [user.pk_user_id]);

    const handleComment = React.useCallback(async () => {
        if (!birthdayDialogProps.new_comment.trim()) return;

        const { ok, } = await api.post('communication/birthday_comment', {
            fk_birthday_id: birthdayDialogProps.pk_birthday_id,
            fk_user_id: user.pk_user_id,
            comment: birthdayDialogProps.new_comment,
        });
        if (ok) {
            setDashboard(prevState => ({
                ...prevState,
                birthdays: prevState.birthdays.map(birthday => (
                    birthday.pk_birthday_id === birthdayDialogProps.pk_birthday_id ?
                        { ...birthday, comments: [...birthday.comments, { user_full_name: user.full_name, comment: birthdayDialogProps.new_comment }], }
                        :
                        birthday
                )),
            }));
            setBirthdayDialogProps(prevState => ({ ...prevState, pk_birthday_id: '', new_comment: '', }));
        }
    }, [birthdayDialogProps, user.pk_user_id, user.full_name]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { ok, data } = await api.get('communication/dashboard');
                if (ok) {
                    setDashboard(data);
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
        <Paper sx={{ p: 2, }}>
            <Grid container spacing={3}>
                <Grid size={12} display="flex">
                    <Typography variant="h6" color="primary" width="80%">¡<b>Bienvenido,</b> {user.full_name}!</Typography>
                    {!isMdDownScreen && <Weather />}
                </Grid>
                {isMdDownScreen && <Grid size={12}><Weather /></Grid>}
                <Grid size={isMdDownScreen ? 12 : 8} bgcolor="white" borderRadius={1} p={1}>
                    <Grid container spacing={1} direction="column">
                        <Grid size={12}>
                            <Typography variant="body1" fontWeight="bold" color="primary">
                                <StylizedLink to="/comunicacion-interna?tab=Comunicados" title="Clic para ver todos los comunicados">Comunicados<StylizedIcon className="ri-megaphone-line ml-1"></StylizedIcon></StylizedLink>
                            </Typography>
                            <hr />
                        </Grid>
                        {dashboard.posts && dashboard.posts.length > 0 ?
                            dashboard.posts.slice(0, 2).map((post, i) => (
                                <Grid key={post.pk_post_id} size={12}>
                                    <Link to={`/comunicacion-interna?tab=Comunicados&id=${i + 1}`}>
                                        <Card variant="outlined" sx={{ display: 'flex', height: '15vh', }}>
                                            <CardMedia component="img" src={post.file ? `data:image/${post.file_extension};base64,${post.file}` : notImage} sx={{ maxWidth: '35%', }} title={post.title} />
                                            <CardContent sx={{ width: '65%', }}>
                                                <Typography component="div" variant="body2" color="primary" fontWeight="bold">{post.title}</Typography>
                                                <StylizedPreviewContent component="div" variant="body2" color="primary" mt={1} title="Clic para ver comunicado...">{post.content.replace(/<\/?[^>]+(>|$)/g, '')}</StylizedPreviewContent>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                            ))
                            :
                            <WereCaughtUp mt={0} />}
                    </Grid>
                </Grid>
                <Grid size={isMdDownScreen ? 12 : 4} bgcolor="white" borderRadius={1} p={1}>
                    <Grid container spacing={1} direction="column">
                        <Grid size={12}>
                            <Typography variant="body1" fontWeight="bold" color="primary">
                                <StylizedLink to="/comunicacion-interna?tab=Eventos" title="Clic para ver todos los eventos">Eventos<StylizedIcon className="ri-calendar-event-line ml-1"></StylizedIcon></StylizedLink>
                            </Typography>
                            <hr />
                        </Grid>
                        {dashboard.events && dashboard.events.length > 0 ?
                            dashboard.events.slice(0, 2).map((post, i) => (
                                <Grid key={post.pk_post_id} size={12}>
                                    <Link to={`/comunicacion-interna?tab=Eventos&id=${i + 1}`}>
                                        <Card variant="outlined" sx={{ display: 'flex', height: '15vh', }}>
                                            <CardMedia component="img" src={post.file ? `data:image/${post.file_extension};base64,${post.file}` : notImage} sx={{ maxWidth: '35%', }} title={post.title} />
                                            <CardContent sx={{ width: '65%', }}>
                                                <Typography component="div" variant="body2" color="primary" fontWeight="bold">{post.title}</Typography>
                                                <StylizedPreviewContent component="div" variant="body2" color="primary" mt={1} title="Clic para ver evento...">{post.content.replace(/<\/?[^>]+(>|$)/g, '')}</StylizedPreviewContent>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                            ))
                            :
                            <WereCaughtUp mt={0} />}
                    </Grid>
                </Grid>
                <Grid size={isMdDownScreen ? 12 : 4} bgcolor="white" borderRadius={1} p={1}>
                    <Grid container spacing={1} direction="column">
                        <Grid size={12}>
                            <Typography variant="body1" fontWeight="bold" color="primary">
                                <StylizedLink to="/comunicacion-interna?tab=Espacio C4" title="Clic para ver todo el Espacio C4">Espacio C4<StylizedIcon className="ri-alarm-warning-line ml-1"></StylizedIcon></StylizedLink>
                            </Typography>
                            <hr />
                        </Grid>
                        {dashboard.c4 && dashboard.c4.length > 0 ?
                            dashboard.c4.slice(0, 2).map((post, i) => (
                                <Grid key={post.pk_post_id} size={12}>
                                    <Link to={`/comunicacion-interna?tab=Espacio C4&id=${i + 1}`}>
                                        <Card variant="outlined" sx={{ display: 'flex', height: '15vh', }}>
                                            <CardMedia component="img" src={post.file ? `data:image/${post.file_extension};base64,${post.file}` : notImage} sx={{ maxWidth: '35%', }} title={post.title} />
                                            <CardContent sx={{ width: '65%', }}>
                                                <Typography component="div" variant="body2" color="primary" fontWeight="bold">{post.title}</Typography>
                                                <StylizedPreviewContent component="div" variant="body2" color="primary" mt={1} title="Clic para ver publicación...">{post.content.replace(/<\/?[^>]+(>|$)/g, '')}</StylizedPreviewContent>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </Grid>
                            ))
                            :
                            <WereCaughtUp mt={0} />}
                    </Grid>
                </Grid>
                <Grid size={isMdDownScreen ? 12 : 4} bgcolor="white" borderRadius={1} p={1}>
                    <Grid container spacing={1} direction="column">
                        <Grid size={12}>
                            <Typography variant="body1" fontWeight="bold" color="primary">
                                <StylizedLink to="/comunicacion-interna?tab=Novedades" title="Clic para ver todas las novedades">Novedades<StylizedIcon className="ri-news-line ml-1"></StylizedIcon></StylizedLink>
                            </Typography>
                            <hr />
                        </Grid>
                        {dashboard.news && dashboard.news.length > 0 ?
                            <>
                                {dashboard.news.slice(0, 2).map((post, index) => (
                                    <Grid key={index} size={12}>
                                        <Link to="/comunicacion-interna?tab=Novedades">
                                            <Card variant="outlined" sx={{ display: 'flex', }}>
                                                <CardMedia title={1} sx={{ alignItems: 'center', display: 'flex', }}>
                                                    <Avatar src={post.file ? `data:image/${post.file_extension};base64,${post.file}` : ''} title={post.user_full_name} sx={{ ml: 1 }} />
                                                </CardMedia>
                                                <CardContent>
                                                    <Typography variant="body2" color="primary" fontWeight="bold">Aniversario {post.years_worked} {post.years_worked > 1 ? 'años' : 'año'}</Typography>
                                                    <Typography variant="body2" color="secondary">{post.user_full_name}</Typography>
                                                    <Typography variant="body2" color="secondary">{post.job_position}</Typography>
                                                    <Typography variant="body2" color="secondary">{post.job_position_office_short}</Typography>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </Grid>
                                ))}
                                <Typography variant="body2" color="primary" textAlign="right"><Link to="/comunicacion-interna?tab=Novedades">Ver más...</Link></Typography>
                            </>
                            :
                            <WereCaughtUp mt={0} />}
                    </Grid>
                </Grid>
                <Grid size={isMdDownScreen ? 12 : 4} bgcolor="white" borderRadius={1} p={1}>
                    <Typography variant="body1" fontWeight="bold" color="primary">
                        <StylizedLink to="/comunicacion-interna?tab=Cumpleaños" title="Clic para ver los cumpleaños de la semana">Cumpleaños<StylizedIcon className="ri-cake-2-line ml-1"></StylizedIcon></StylizedLink>
                    </Typography>
                    <hr />
                    <Grid container spacing={2} direction="row">
                        {dashboard.birthdays && dashboard.birthdays.length > 0 ?
                            dashboard.birthdays.map(post => (
                                <Grid key={post.pk_birthday_id} size={12}>
                                    <Stack direction="row" alignItems="center">
                                        <Avatar src={post.file ? `data:image/${post.file_extension};base64,${post.file}` : ''} title={post.user_full_name} sx={{ ml: 1 }} />
                                        <Typography variant="body2" color="primary" className="ml-1">
                                            {post.user_full_name}
                                            <br />
                                            <b className="mr-1">{post.count_reactions}</b>
                                            <i id={`like_${post.pk_birthday_id}`} className="ri-thumb-up-line mr-1" style={{ cursor: 'pointer', color: REACTIONS_COLORS['default'], }} title="Me gusta" onClick={() => handleReaction(post.pk_birthday_id, 'like')}></i>
                                            <i id={`love_${post.pk_birthday_id}`} className="ri-heart-line mr-1" style={{ cursor: 'pointer', color: REACTIONS_COLORS['default'], }} title="Me encanta" onClick={() => handleReaction(post.pk_birthday_id, 'love')}></i>
                                            <i className="ri-chat-1-line" style={{ cursor: 'pointer', color: REACTIONS_COLORS['default'], }} onClick={() => {
                                                setBirthdayDialogProps(prevState => ({ ...prevState, pk_birthday_id: post.pk_birthday_id, all_comments: post.comments }));
                                                handleOpen();
                                            }} title="Comentar"></i>
                                        </Typography>
                                    </Stack>
                                </Grid>
                            ))
                            :
                            <WereCaughtUp mt={1} />}
                    </Grid>
                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose} slotProps={{ paper: { sx: { width: '40%', } } }}>
                <DialogContent>
                    <Box mb={2}>
                        {birthdayDialogProps.all_comments && birthdayDialogProps.all_comments.length > 0 &&
                            birthdayDialogProps.all_comments.map((birthdayComment, index) => (
                                <React.Fragment key={index}>
                                    <Typography variant="body2" color="primary"><b>{birthdayComment.user_full_name}</b> comentó:</Typography>
                                    <Typography variant="body2" color="primary" mb={2}>{birthdayComment.comment}</Typography>
                                </React.Fragment>
                            ))}
                    </Box>
                    <Stack direction="row" alignItems="center">
                        <Avatar src={user.file ? `data:image/${user.file_extension};base64,${user.file}` : ''} />
                        <textarea className="ml-2" defaultValue={birthdayDialogProps.new_comment} placeholder="Escribe algo para comentar..." onChange={(e) => {
                            setBirthdayDialogProps(prevState => ({ ...prevState, new_comment: e.target.value, }));
                        }} style={{
                            color: theme.palette.primary.main,
                            fontFamily: theme.typography.fontFamily,
                            resize: 'none',
                            width: '100%',
                        }} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => {
                        handleComment();
                        handleClose();
                    }}>
                        Comentar
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    )
};

export default Home;