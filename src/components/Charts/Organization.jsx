import React from 'react';
import PropTypes from 'prop-types';
import { Tree, TreeNode } from 'react-organizational-chart';
import {
    Avatar,
    Backdrop,
    Box,
    Card,
    CircularProgress,
    Grid2 as Grid,
    IconButton,
    styled,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import GridLayout from '../../components/GridLayout/GridLayout';
import ZoomableContainer from '../Zoom/Zoom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import api from '../../api/api';
import NoData from '../Placeholders/NoData';

const StylizedTreeContainer = styled(Box)(() => ({
    position: 'absolute',
    left: 0,
    right: 0,
}));

const StylizedCard = styled(Card)(({ theme, level, available }) => ({
    alignItems: 'center',
    border: 0,
    textShadow: available === 'true' ? 'none' : '0.5px 0.5px 4px black',
    backgroundColor: available === 'true' ? theme.palette.primary[(level > 4 ? 4 : level) + '00'] : '#DDD',
    display: 'flex',
    margin: '0 auto',
    maxWidth: '170px',
    padding: theme.shape.padding,
    width: '100%',
}));

const StylizedTreeNodeContainer = styled(Box)(() => ({
    alignItems: 'center',
    display: 'inline-flex',
    width: '150px',
}));

const StylizedCardAvatarContainer = styled(Box)(() => ({
    width: '30%',
}));

const StylizedCardAvatar = styled(Avatar)(() => ({
    height: '5vh',
    margin: '0 auto',
    width: '5vh',
}));

const StylizedCardTextContainer = styled(Box)(() => ({
    textAlign: 'right',
    width: '70%',
    wordWrap: 'break-word',
}));

const Node = ({ data, level, }) => {
    const [expandedNodes, setExpandedNodes] = React.useState({});
    const toggleExpand = (nodeId) => setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId], }));

    if (data && data.length > 0) {
        return (
            data.map((child, i) => {
                const expanded = expandedNodes[child.id] ?? false;
                return (
                    <TreeNode
                        key={`TreeNode_${i}`}
                        label={
                            <>
                                <StylizedCard variant="outlined" level={level} available={child.name.trim() ? 'true' : 'false'}>
                                    <StylizedTreeNodeContainer>
                                        <StylizedCardAvatarContainer>
                                            <StylizedCardAvatar src={`data:image/${child.file_extension};base64,${child.file}`} />
                                        </StylizedCardAvatarContainer>
                                        <StylizedCardTextContainer>
                                            <Typography variant="body2" color="white" fontWeight="bold" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" ml={2} title={child.name.trim() || '~Sin asignar'}>{child.name.trim() || '~Sin asignar'}</Typography>
                                            <Typography variant="body2" color="white" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" ml={2} title={child.position}>{child.position}</Typography>
                                            <Typography variant="body2" color="white">{child.location}</Typography>
                                        </StylizedCardTextContainer>
                                    </StylizedTreeNodeContainer>
                                </StylizedCard>
                                {child.children && child.children.length > 0 &&
                                    <IconButton onClick={() => toggleExpand(child.id)}>
                                        {expanded ? <ExpandLess /> : <ExpandMore />}
                                    </IconButton>}
                            </>
                        }>
                        {expanded ?
                            child.children && child.children.length > 0 && child.children.map((_child, _i) => (
                                <Node key={_i} data={[{ ..._child }]} level={level + 1} />
                            ))
                            :
                            null}
                    </TreeNode>
                )
            })
        );
    }

    return (<></>);
};

Node.propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.array,
};

const Organization = () => {
    const [data, setData] = React.useState({});
    const [expanded, setExpanded] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const toggleExpand = () => setExpanded(prev => !prev);

    const theme = useTheme();
    const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const { ok, data, } = await api.get('organization');
                if (ok) setData(data);
            }
            catch (error) {
                console.log('Error al cargar la información:', error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (<Backdrop open={loading} invisible><CircularProgress /></Backdrop>);

    return (
        <GridLayout style={{ overflow: 'hidden' }}>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary" className="mb-1">ORGANIGRAMA</Typography>
                {data && Object.keys(data).length > 0 ?
                    <ZoomableContainer isLargeUpScreen={isLgUp} theme={theme}>
                        <StylizedTreeContainer>
                            <Tree
                                lineWidth={expanded ? '0px' : '0px'}
                                lineColor={theme.palette.secondary.light}
                                lineBorderRadius={0}
                                label={
                                    <>
                                        <StylizedCard variant="outlined" level={1} available={'true'}>
                                            <StylizedTreeNodeContainer>
                                                <StylizedCardAvatarContainer>
                                                    <StylizedCardAvatar src={data.file ? `data:image/${data.file_extension};base64,${data.file}` : ''} />
                                                </StylizedCardAvatarContainer>
                                                <StylizedCardTextContainer>
                                                    <Typography variant="body2" color="white" fontWeight="bold" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" ml={2} title={data.name.trim() || '~Sin asignar'}>{data.name || '~Sin asignar'}</Typography>
                                                    <Typography variant="body2" color="white" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" ml={2} title={data.position}>{data.position}</Typography>
                                                    <Typography variant="body2" color="white">{data.location}</Typography>
                                                </StylizedCardTextContainer>
                                            </StylizedTreeNodeContainer>
                                        </StylizedCard>
                                        {data.children.length > 0 &&
                                            <IconButton onClick={toggleExpand}>
                                                {expanded ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>}
                                    </>
                                }>
                                {expanded && data.children.length > 0 && <Node data={data.children} level={2} />}
                            </Tree>
                        </StylizedTreeContainer>
                    </ZoomableContainer>
                    :
                    <NoData />}
            </Grid>
        </GridLayout>
    );
};

Organization.propTypes = {
    data: PropTypes.shape({
        name: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        children: PropTypes.array,
    }).isRequired,
};

export default Organization;