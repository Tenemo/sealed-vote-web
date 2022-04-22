import React, { ReactElement, useEffect } from 'react';
import { CssBaseline, ThemeProvider, CircularProgress } from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';
import 'fonts/Roboto-Regular.ttf';

import { darkTheme } from 'styles/theme';
import { store, persistor } from 'store/configureStore';

import App from 'components/App';
import 'styles/global.scss';

export const Root = (): ReactElement => {
    useEffect(() => {
        // https://stackoverflow.com/questions/31402576/enable-focus-only-on-keyboard-use-or-tab-press
        document.body.addEventListener('mousedown', () =>
            document.body.classList.add('using-mouse'),
        );
        document.body.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.remove('using-mouse');
            }
        });
    }, []);

    return (
        <Provider store={store}>
            <PersistGate loading={<CircularProgress />} persistor={persistor}>
                <HelmetProvider>
                    <ThemeProvider theme={darkTheme}>
                        <CssBaseline enableColorScheme />
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </ThemeProvider>
                </HelmetProvider>
            </PersistGate>
        </Provider>
    );
};

export default Root;
