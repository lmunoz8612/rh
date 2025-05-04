import React from "react";
import {
    Tabs,
    Tab,
    Box,
} from "@mui/material";

const TabPanel = ({ children, value, index }) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && (
                <Box p={1}>{children}</Box>
            )}
        </div>
    );
};

export default function HorizontalTabs({ tabLabels, tabValues, defaultValue = 0 }) {
    const [value, setValue] = React.useState(defaultValue);

    const handleChange = (e, newValue) => setValue(newValue);

    return (
        <Box sx={{ width: "100%" }}>
            <Tabs value={value} onChange={handleChange}>
                {tabLabels.map((tabLabel, index) => (
                    <Tab key={'tab-label-' + index} label={tabLabel} />
                ))}
            </Tabs>
            {tabValues.map((tabValue, index) => (
                <TabPanel key={'tab-value-' + index} value={value} index={index}>{tabValue}</TabPanel>
            ))}
        </Box>
    );
}
