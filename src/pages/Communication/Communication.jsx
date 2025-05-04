import React from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../context/Auth/Auth';
import GridLayout from '../../components/GridLayout/GridLayout';
import {
    Backdrop,
    CircularProgress,
    Grid2 as Grid,
    styled,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import WorkAnniversary from '../../templates/WorkAnniversary';
import HappyBirthday from '../../templates/HappyBirthday';
import HorizontalTabs from '../../components/Tabs/Horizontal';
import VerticalTabs from '../../components/Tabs/Vertical';
import WereCaughtUp from '../../components/Placeholders/WereCaughtUp';
import { ROLES } from '../../assets/constants/constants';
import vittiLogoV from '../../assets/imgs/logoV.png';
import api from '../../api/api';

const StylizedLabelContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.shape.padding,
}));

const StylizedContentContainer = styled('div')(({ theme }) => ({
    marginLeft: theme.shape.margin * 2,
    width: '100%',
}));

const tabLabels = ['Comunicados', 'Eventos', 'Espacio C4', 'Novedades', 'Cumpleaños'];

const Communication = () => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const postId = params.get('id');
    const user = useSelector((state) => state.user.data);
    const { role, has_signed_policies } = useAuth();
    const isAdmin = [ROLES.SUPER_ADMIN, ROLES.ADMIN].includes(role);
    const [loading, setLoading] = React.useState(true);
    const [dashboard, setDashboard] = React.useState([]);
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const groupedData = React.useCallback((data) => {
        return data.reduce((accumulated, item) => {
            if (!accumulated[item.title]) {
                accumulated[item.title] = [];
            }

            accumulated[item.title].push(item);
            return accumulated;
        }, {})
    }, []);

    const renderTabContent = (tab, data, defaultValue) => {
        if (data) {
            switch (tab) {
                case 'news':
                    const newsData = groupedData(data);
                    return (
                        !isMediumScreen ?
                            <VerticalTabs
                                tabLabels={Object.keys(newsData).map((title, index) => (
                                    <StylizedLabelContainer key={index}>
                                        <i className="ri-award-fill" style={{ fontWeight: 'normal', fontSize: '30px', color: theme.palette.primary.main, }}></i>
                                        <Typography variant="body2" color="primary" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" textAlign="left">{title}</Typography>
                                    </StylizedLabelContainer>
                                ))}
                                tabValues={Object.keys(newsData).map((title, index) => (
                                    <WorkAnniversary key={index} usersData={newsData[title]} />
                                ))}
                                slotProps={{ indicator: { hidden: true, } }}
                                defaultValue={defaultValue}
                            />
                            :
                            Object.keys(newsData).map((title, index) => (
                                <WorkAnniversary key={index} title={title} usersData={newsData[title]} isMediumScreen={isMediumScreen} mt={isMediumScreen ? 1 : 2} />
                            ))
                    );
                case 'birthdays':
                    return (
                        !isMediumScreen ?
                            <VerticalTabs
                                tabLabels={data.map(row => (
                                    <StylizedLabelContainer key={row.pk_birthday_id}>
                                        <i className="ri-cake-2-line" style={{ fontWeight: 'normal', fontSize: '30px', color: theme.palette.primary.main, }}></i>
                                        <Typography variant="body2" color="primary" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" textAlign="left">{row.title}</Typography>
                                    </StylizedLabelContainer>
                                ))}
                                tabValues={data.map(row => (
                                    <HappyBirthday keyIndex={row.pk_birthday_id} userData={row} />
                                ))}
                                slotProps={{ indicator: { hidden: true, } }}
                                defaultValue={defaultValue}
                            />
                            :
                            data.map((row, index) => (
                                <HappyBirthday keyIndex={index} userData={row} isMediumScreen={isMediumScreen} mt={2} />
                            ))
                    );
                case 'posts':
                case 'events':
                case 'c4':
                default:
                    return (
                        !isMediumScreen ?
                            <VerticalTabs
                                tabLabels={data.map(row => (
                                    <StylizedLabelContainer>
                                        <img src={vittiLogoV} alt="Vitti Logistic" style={{ width: '30px' }} />
                                        <Typography variant="body2" color="primary" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" textAlign="left">{row.title}</Typography>
                                    </StylizedLabelContainer>
                                ))}
                                tabValues={data.map(row => (
                                    <StylizedContentContainer>
                                        <img src={`data:image/${row.file_extension};base64,${row.file}`} alt={row.title} style={{ maxHeight: '40vh', maxWidth: '100%', }} />
                                        <Typography component="div" variant="body1" color="primary" fontWeight="bold">{row.title}</Typography>
                                        <hr />
                                        <Typography component="div" variant="body2" color="primary" dangerouslySetInnerHTML={{ __html: row.content }} />
                                    </StylizedContentContainer>
                                ))}
                                slotProps={{ indicator: { hidden: true, } }}
                                defaultValue={defaultValue}
                            />
                            :
                            data.map((row, index) => (
                                <StylizedContentContainer key={row.title + '_' + index} className="mt-2">
                                    <Typography component="div" variant="body1" color="primary" fontWeight="bold">{row.title}</Typography>
                                    <hr />
                                    <img src={`data:image/${row.file_extension};base64,${row.file}`} alt={row.title} style={{ maxWidth: '100%', }} />
                                    <Typography component="div" variant="body2" color="primary" dangerouslySetInnerHTML={{ __html: row.content }} />
                                </StylizedContentContainer>
                            ))
                    );
            }
        }
    };

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
                        COMUNICACIÓN INTERNA
                    </Typography>
                    <HorizontalTabs tabLabels={tabLabels} tabValues={[
                        dashboard.posts && dashboard.posts.length > 0 ? renderTabContent('posts', dashboard.posts, (postId - 1)) : <WereCaughtUp />,
                        dashboard.events && dashboard.events.length > 0 ? renderTabContent('events', dashboard.events, (postId - 1)) : <WereCaughtUp />,
                        dashboard.c4 && dashboard.c4.length > 0 ? renderTabContent('c4', dashboard.c4, (postId - 1)) : <WereCaughtUp />,
                        dashboard.news && dashboard.news.length > 0 ? renderTabContent('news', dashboard.news) : <WereCaughtUp />,
                        dashboard.birthdays && dashboard.birthdays.length > 0 ? renderTabContent('birthdays', dashboard.birthdays) : <WereCaughtUp />,
                    ]} defaultValue={tab ? tabLabels.indexOf(tab) : 0} />
                </Grid>
            </GridLayout>
        </>
    );
};

export default Communication;