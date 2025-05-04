import React from 'react';
import {
    Chip,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Stack,
    styled,
    useTheme,
    useMediaQuery,
    OutlinedInput
} from '@mui/material';

const StylizedChipFilterContainer = styled(Box)(() => ({
    width: '100%',
}));

const StylizedChipFilter = styled(Chip)(({ theme }) => ({
    border: `1px solid ${theme.palette.primary.main}`,
    color: theme.palette.primary.main,
    fontWeight: 'bold',
}));

const ChipFilter = () => {
    const options = React.useMemo(() => [
        'Transformación Digital', 'Recursos Humanos', 'Operaciones', 'Comercial',
    ], []);
    const [selected, setSelected] = React.useState([]);

    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleSelect = (event) => setSelected(event.target.value);
    const handleDeleteChip = (chipToRemove) => setSelected(selected.filter(chip => chip !== chipToRemove));

    return (
        <Stack direction={isMediumScreen ? 'column' : 'row'} spacing={1} sx={{ width: '100%' }}>
            {!isMediumScreen &&
                <StylizedChipFilterContainer>
                    {selected.map((chip) => (
                        <StylizedChipFilter
                            key={chip}
                            label={chip}
                            onDelete={() => handleDeleteChip(chip)}
                        />
                    ))}
                </StylizedChipFilterContainer>}
            <FormControl sx={{ width: isMediumScreen ? '100%' : '50%', }}>
                <InputLabel size="small" shrink>Filtrar</InputLabel>
                <Select
                    size="small"
                    multiple
                    value={selected}
                    label="Filtrar por"
                    input={<OutlinedInput notched label={'Filtrar'} />}
                    onChange={handleSelect}>
                    {options.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {isMediumScreen &&
                <StylizedChipFilterContainer>
                    {selected.map((chip) => (
                        <StylizedChipFilter key={chip} label={chip} onDelete={() => handleDeleteChip(chip)} />
                    ))}
                </StylizedChipFilterContainer>}
        </Stack>
    );
};

export default ChipFilter;