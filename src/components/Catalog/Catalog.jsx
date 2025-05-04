import React from 'react';
import {
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    useTheme,
    TextField,
} from '@mui/material';
import api from '../../api/api';
import { CATALOG_FIELDS } from './CatalogFields.js';

const Catalog = ({ name = '', label, value, apiEndpoint, onChange, parentId, excludeOption = '', extraOption, className, placeholder = '<Seleccione una opción>', error, ...rest }) => {
    const theme = useTheme();
    const [options, setOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!apiEndpoint) return;

        const fetchCatalog = async () => {
            try {
                setLoading(true);
                const { ok, data } = await api.get(apiEndpoint);

                if (!ok) return setOptions([]);

                const [schema, catalog] = apiEndpoint.includes('?available') ? apiEndpoint.split('/').slice(-3) : apiEndpoint.split('/').slice(-2);
                const catalogFields = CATALOG_FIELDS[schema]?.[catalog];

                if (!catalogFields || (catalogFields.parent_id && !parentId)) return null;

                let newOptions = data
                    .map(item => ({
                        id: item[catalogFields.id],
                        description: item[catalogFields.description],
                        parent_id: item[catalogFields.parent_id] ?? null,
                        status: item[catalogFields.status] ? parseInt(item[catalogFields.status]) : null,
                    }))
                    .filter(option => option.id && option.description && (option.status === 1 || option.status === null));

                if (parentId) {
                    newOptions = newOptions.filter(({ parent_id }) => parent_id === parentId);
                }
                
                if (excludeOption) {
                    newOptions = newOptions.filter(option => String(option.id) !== String(excludeOption));
                }
                
                if (extraOption) {
                    newOptions.push(extraOption);
                }

                setOptions(newOptions);
            }
            catch (error) {
                setOptions([]);
                console.error('Error al cargar la información:', error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchCatalog();
    }, [apiEndpoint, parentId, extraOption, excludeOption]);

    if (loading) return (<></>);

    return (
        <FormControl className={className} fullWidth>
            <InputLabel shrink error={error === true || false}>{label}</InputLabel>
            <Select
                name={name}
                value={options.some(option => option.id === value) ? value : ''}
                onChange={onChange}
                label={label}
                size="small"
                fullWidth
                displayEmpty
                error={error === true || false}
                children={<TextField onChange={e => e.preventDefault()} />}
                MenuProps={{
                    PaperProps: {
                        variant: 'elevation',
                        sx: { maxHeight: '20%' }
                    },
                }}
                {...rest}>
                <MenuItem sx={{ fontSize: theme.typography.fontSize, }} value="" disabled>{placeholder}</MenuItem>
                {options.map(option => (
                    <MenuItem key={option.id} sx={{ fontSize: theme.typography.fontSize, }} value={option.id}>{option.description}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default Catalog;