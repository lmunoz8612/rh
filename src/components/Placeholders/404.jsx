import { CardMedia } from "@mui/material";
import notFound from '../../assets/imgs/placeholders/404.png';

const NoPage = () => (
    <CardMedia component="img" src={notFound} />
);

export default NoPage;