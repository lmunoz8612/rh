import React from 'react';
import GridLayout from '../../components/GridLayout/GridLayout';
import { Grid2 as Grid, Typography } from '@mui/material';

const Survey = () => {
    return (
        <GridLayout>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary">ENCUESTA CLIMA LABORAL</Typography>
            </Grid>
        </GridLayout>
    )
};

export default Survey;