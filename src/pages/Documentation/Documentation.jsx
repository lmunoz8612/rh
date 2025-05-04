import React from 'react';
import GridLayout from '../../components/GridLayout/GridLayout';
import { Grid2 as Grid, Typography } from '@mui/material';

const Documentation = () => {
    return (
        <GridLayout>
            <Grid size={12}>
                <Typography variant="h6" fontWeight="bold" color="primary">DOCUMENTACIÓN</Typography>
            </Grid>
        </GridLayout>
    )
};

export default Documentation;