import React from 'react';
import PropTypes from 'prop-types';
import {
    Grid2 as Grid,
    useTheme,
} from "@mui/material";

const GridLayout = (props) => {
    // props
    const direction = props.direction || 'row';
    const columnSpacing = props.columnSpacing || 4;
    const rowSpacing = props.rowSpacing || 1;
    const children = props.children;
    const maxHeight = props.children || true;
    const style = props.style;
    const theme = useTheme();

    return (
        <Grid
            container
            columnSpacing={columnSpacing}
            rowSpacing={rowSpacing}
            border={1}
            direction={direction}
            sx={{
                borderRadius: 1,
                borderColor: theme.palette.primary.main,
                minHeight: maxHeight ? '100%' : '',
                padding: 2,
                marginLeft: 2,
                marginRight: 2,
                ...style
            }}
        >
            {children}
        </Grid>
    )
};

GridLayout.propTypes = {
    children: PropTypes.node.isRequired,
    direction: PropTypes.oneOf(['row', 'column']),
    columnSpacing: PropTypes.number,
    rowSpacing: PropTypes.number,
    maxHeight: PropTypes.bool,
    style: PropTypes.object,
};

export default GridLayout;