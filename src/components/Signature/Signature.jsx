import React from 'react';
import SignatureCanvas from 'react-signature-canvas';
import {
    Box,
    Button,
    styled,
    Typography,
    useTheme,
} from '@mui/material';
import { useSelector } from 'react-redux';
import api from '../../api/api';

const StylizedContainer = styled(Box)(() => ({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',
    marginBottom: '5px',
    height: '10vh',
    width: '50%',
}));

const StylizedImg = styled('img')(({ theme }) => ({
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    height: '10vh',
    width: '100%',
}));

const StylizedIcon = styled('i')(({ theme }) => ({
    fontSize: '2rem',
    color: theme.palette.primary.main,
}));

const StylizedClearIcon = styled('i')(({ theme }) => ({
    fontSize: '1rem',
    color: theme.palette.primary.main,
    position: 'absolute',
}));

const Signature = ({ onClose }) => {
    const user = useSelector((state) => state.user.data);
    const [loading, setLoading] = React.useState(false);
    const [isSavedSignature, setIsSavedSignature] = React.useState(false);
    const [savedSignature, setSavedSignature] = React.useState(null);
    const signaturePad = React.useRef(null);
    const theme = useTheme();

    const handleClear = React.useCallback(() => {
        if (signaturePad.current) signaturePad.current.clear();
    }, []);

    const handleSave = React.useCallback(async () => {
        try {
            let fileBase64 = '';
            fileBase64 = signaturePad.current?.toDataURL().split(',')[1];

            if (fileBase64 && !isSavedSignature) {
                setLoading(true);
                await api.post('user_files', {
                    user_id: user.pk_user_id,
                    type_file: 2,
                    file: fileBase64,
                });
            }

            if (onClose && typeof onClose === 'function') {
                if (isSavedSignature && savedSignature) {
                    onClose(savedSignature);
                }
                else {
                    onClose(fileBase64);
                }
            }
        }
        catch(error) {
            console.error('Error:', error);
        }
        finally {
            setLoading(false);
        }
    }, [isSavedSignature, user.pk_user_id, savedSignature, onClose]);

    const handleToggleSignature = async (method) => {
        switch (method) {
            case 'pad':
                setIsSavedSignature(false);
                break;
            case 'saved':
                setIsSavedSignature(true);
                await fetchSavedSignature();
                break;
            default:
                break;
        }
    };

    const fetchSavedSignature = async () => {
        try {
            const { ok, file } = await api.get(`user_files/?user_id=${user.pk_user_id}&type_file=2`);
            if (ok && file) {
                setSavedSignature(file);
            };
        }
        catch (error) {
            console.error('Error fetching signature:', error);
        }
    };

    React.useEffect(() => {
        const canvas = signaturePad.current?.getCanvas();
        if (canvas) {
            canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
            canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        }
    }, []);

    return (
        <Box
            sx={{
                border: `1px solid ${theme.palette.primary.main}`,
                borderRadius: theme.shape.borderRadius + 'px',
                padding: theme.shape.padding + 'px',
                textAlign: 'center',
                width: '100%',
            }}>
            <Box>
                <StylizedIcon className="ri-sketching ml-2" title="Firmar con pad" onClick={() => handleToggleSignature('pad')} />
                <StylizedIcon className="ri-save-line ml-2" title="Utilizar firma guardada" onClick={() => handleToggleSignature('saved')} />
            </Box>
            {isSavedSignature ?
                savedSignature ?
                    <StylizedContainer>
                        <StylizedImg src={`data:image/png;base64,${savedSignature}`} alt="" />
                    </StylizedContainer>
                    :
                    <StylizedContainer>
                        <Typography variant="body2" color="primary" mb={1}>[No existe una firma guardada.]</Typography>
                    </StylizedContainer>
                :
                <>
                    <SignatureCanvas ref={signaturePad} penColor="black" canvasProps={{
                        style: {
                            border: `1px solid ${theme.palette.primary.main}`,
                            borderRadius: theme.shape.borderRadius,
                            height: '10vh',
                            width: '50%'
                        }
                    }} />
                    <StylizedClearIcon className="ri-delete-bin-line ml-1" title="Borrar Firma" onClick={handleClear} />
                </>}
            <Typography variant="body2" color="primary" fontWeight="bold" mb={1}>{user.full_name}</Typography>
            <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>Aplicar</Button>
        </Box>
    );
};

export default Signature;