import { CardMedia } from '@mui/material';
import permissionDenied from '../../assets/imgs/placeholders/permissionDenied.png';

const PermissionDenied = () => (
    <CardMedia component="img" src={permissionDenied} />
);

export default PermissionDenied;
