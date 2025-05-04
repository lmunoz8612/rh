import React from 'react';
import GridLayout from '../../components/GridLayout/GridLayout';
import { Grid2 as Grid, Typography } from '@mui/material';

const Benefits = () => {
    return (
        <GridLayout>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary">BENEFICIOS</Typography>
            </Grid>
        </GridLayout>
    )
};

export default Benefits;