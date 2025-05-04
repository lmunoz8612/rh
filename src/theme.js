import { createTheme } from '@mui/material/styles';

const baseFontSize = 12; // px
const baseMargin = 8; // px
const baseSpacing = 8; // px
const baseBorderRadius = 8; // px
const colors = {
    default: '#0F2746',
    main: '#0F2746',
    secondary: '#2E4771',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    success: '#4CAF50',
    disabled: '#A6A6A6',
};

// Definir una paleta de colores personalizada.
const theme = createTheme({
    typography: {
        fontSize: baseFontSize,
        // ...
    },
    palette: {
        primary: {
            main: colors.main,
            '100': colors.secondary,
            '200': '#477BA9',
            '300': '#528CC1',
            '400': '#5f9CD5',
        },
        secondary: {
            main: colors.secondary,
        },
        error: {
            main: colors.error,
        },
        warning: {
            main: colors.warning,
        },
        info: {
            main: colors.info,
        },
        success: {
            main: colors.success,
        },
        background: {
            main: colors.main,
            secondary: colors.secondary,
        },
        default: {
            main: colors.disabled,
        },
        disabled: {
            main: colors.disabled,
        },
        // ...
    },
    shape: {
        borderRadius: baseBorderRadius,
        margin: baseMargin,
        padding: baseSpacing,
    },
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: baseBorderRadius * 2,
                    color: colors.main,
                    fontSize: baseFontSize,
                    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'red !important',
                    },
                },
                notchedOutline: {
                    border: `1px solid ${colors.main} !important`,
                    fontSize: (baseFontSize + 2) + 'px',
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: baseFontSize + 2,
                    fontWeight: 'bold',
                    color: colors.main,
                    '&.Mui-disabled': {
                        color: colors.main,
                    },
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    borderRadius: '16px',
                },
                outlinedPrimary: {
                    borderRadius: '16px',
                }
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    "&.MuiChip-colorDefault": {
                        backgroundColor: "#AFAFAF",
                    },
                },
            },
        },
    },
});

export default theme;