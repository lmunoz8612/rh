import React from "react";
import {
    Tabs,
    Tab,
    Box,
    useTheme,
} from "@mui/material";

const TabPanel = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index} style={{ width: '80%', }}>
            {value === index && (
                <Box p={1}>{children}</Box>
            )}
        </div>
    );
};

export default function VerticalTabs({ tabLabels, tabValues, defaultValue, ...rest }) {
    const theme = useTheme();
    const [value, setValue] = React.useState(defaultValue ? defaultValue : 0);
    
    const handleChange = (e, newValue) => setValue(newValue);

    return (
        <Box sx={{ display: 'flex', width: "100%", }}>
            <Tabs orientation="vertical" value={value} onChange={handleChange} sx={{ width: '20%', }} {...rest}>
                {tabLabels.map((tabLabel, index) => (
                    <Tab key={'tab-label-' + index} label={tabLabel} sx={{
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 0.5,
                        padding: 1,
                        mt: 1,
                        '&.MuiTab-root': {
                            display: 'block',
                        },
                    }} />
                ))}
            </Tabs>
            {tabValues.map((tabValue, index) => (
                <TabPanel key={'tab-value-' + index} value={value} index={index}>{tabValue}</TabPanel>
            ))}
        </Box>
    );
}
