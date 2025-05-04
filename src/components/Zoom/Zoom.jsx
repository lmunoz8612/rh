import React from 'react';
import {
    Box,
    IconButton,
    styled,
    useMediaQuery
} from '@mui/material';
import { $ } from '../../assets/utils/utils';

let newPosX = 0;
let newPosY = 0;
let startPosX = 0;
let startPosY = 0;

const StylizedZoomChildrenContent = styled(Box)(({ value: scale, }) => ({
    backgroundSize: 'cover',
    height: '85%',
    transform: `scale(${scale})`,
    transformOrigin: 'center',
    transition: 'transform 0.3s ease',
    position: 'relative',
}));

const StylizedZoomInOutControls = styled(Box)(({ theme }) => ({
    bottom: theme.shape.margin * 3,
    position: 'absolute',
    right: theme.shape.margin * 4,
    textAlign: 'right',
}));

const Zoom = ({ children, theme, }) => {
    const [scale, setScale] = React.useState(1);
    const isMdScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleZoomIn = React.useCallback(() => setScale(prevScale => (prevScale <= 2) ? prevScale + 0.1 : prevScale), []);
    const handleZoomOut = React.useCallback(() => setScale(prevScale => (prevScale >= 0.2) ? prevScale - 0.1 : prevScale), []);

    const handleZoomInteraction = () => {
        const ZoomChildrenContent = $('ZoomChildrenContent');
        if (ZoomChildrenContent) {
            const content = ZoomChildrenContent.firstChild;
            if (content) {
                content.style.position = 'absolute';

                // Función para manejar el inicio del toque (touchstart)
                content.addEventListener('touchstart', (e) => {
                    const touch = e.touches[0];
                    startPosX = touch.clientX;
                    startPosY = touch.clientY;
                    document.addEventListener('touchmove', onTouchMove);
                    document.addEventListener('touchend', function () {
                        document.removeEventListener('touchmove', onTouchMove);
                    });
                });

                // Función para mover el contenido cuando se toca y se mueve
                const onTouchMove = (e) => {
                    const touch = e.touches[0];
                    newPosX = startPosX - touch.clientX;
                    newPosY = startPosY - touch.clientY;
                    startPosX = touch.clientX;
                    startPosY = touch.clientY;
                    content.style.position = 'absolute';
                    content.style.top = (content.offsetTop - newPosY) + 'px';
                    content.style.left = (content.offsetLeft - newPosX) + 'px';
                };

                // Para la versión de escritorio
                content.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    startPosX = e.clientX;
                    startPosY = e.clientY;
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', function () {
                        document.removeEventListener('mousemove', onMouseMove);
                    });
                });

                const onMouseMove = (e) => {
                    newPosX = startPosX - e.clientX;
                    newPosY = startPosY - e.clientY;
                    startPosX = e.clientX;
                    startPosY = e.clientY;
                    content.style.position = 'absolute';
                    content.style.top = (content.offsetTop - newPosY) + 'px';
                    content.style.left = (content.offsetLeft - newPosX) + 'px';
                };
            }
        }
    };

    React.useEffect(() => {
        handleZoomInteraction();
    }, []);

    return (
        <Box className="ZoomContainer" height={'100%'}>
            <StylizedZoomChildrenContent id="ZoomChildrenContent" className="ZoomChildrenContent" value={scale} sx={{
                overflowX: isMdScreen ? 'scroll' : '',
            }}>
                {children}
            </StylizedZoomChildrenContent>
            <StylizedZoomInOutControls className="ZoomInOutControls">
                <IconButton onClick={handleZoomIn} color="primary" title="zoom in">
                    <i className="ri-zoom-in-line" style={{ fontSize: '24px', color: 'red' }}></i>
                </IconButton>
                <IconButton onClick={handleZoomOut} color="primary" title="zoom out">
                    <i className="ri-zoom-out-line" style={{ fontSize: '24px', color: 'red' }}></i>
                </IconButton>
            </StylizedZoomInOutControls>
        </Box>
    );
};

export default Zoom;