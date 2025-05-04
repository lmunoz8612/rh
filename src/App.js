import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store/store.js';

import Sidebar from './components/Sidebar/Sidebar';
import { Box } from '@mui/system';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppStyles } from './App.css.js';
import './App.css';
import theme from './theme.js';

// @context
import { useAuth } from './context/Auth/Auth';

// @routes
import BrowserRouters from './routes/BrowserRoutes/BrowserRouters';

const App = () => {
    const { auth, } = useAuth();
    const classes = AppStyles();

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div className={`App${auth ? ' Auth' : ''}`}>
                    {auth ?
                        <>
                            <Sidebar />
                            <Box component="main" sx={classes.main}>
                                <BrowserRouters />
                            </Box>
                        </>
                        :
                        <Box sx={classes.App}>
                            <BrowserRouters />
                        </Box>
                    }
                </div>
            </ThemeProvider>
        </Provider>
    )
}

export default App;