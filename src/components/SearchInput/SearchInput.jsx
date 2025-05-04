import React from 'react';
import { TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

const SearchInput = ({ data, filters, onFilter, onPage, lastPage, ...rest }) => {
    const handleFilter = React.useCallback(event => {
        const value = event.target.value;
        if (value === '') {
            onFilter(data);
            onPage(lastPage);
            return;
        }

        const filteredData = data.map(set => 
            set.filter(item => 
                Object.keys(filters).some(key => (
                    item[key]?.toString().toLowerCase().includes(value.toString().toLowerCase())
                ))
            ))
            .filter(set => set.length > 0);

        onFilter(filteredData.flat().length > 0 ? [filteredData.flat()] : []);
        onPage(1);
    }, [data, filters, onFilter, onPage, lastPage]);

    return (
        <TextField
            label="Buscar Por"
            placeholder="Buscar..."
            size="small"
            fullWidth={rest.fullWidth ? true : false}
            slotProps={{
                input: {
                    startAdornment: <Search />
                },
                inputLabel: {
                    shrink: true
                },
            }}
            onChange={handleFilter}
            {...rest}
        />
    )
};

export default SearchInput;