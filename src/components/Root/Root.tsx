import React, { ReactElement, useEffect } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { Provider } from 'react-redux';
import { HistoryRouter as Router } from 'redux-first-history/rr6';
import { HelmetProvider } from 'react-helmet-async';
import 'fonts/Roboto-Regular.ttf';

import { darkTheme } from 'styles/theme';
import { store, history } from 'store/configureStore';

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
            <HelmetProvider>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline enableColorScheme />
                    <Router history={history}>
                        <App />
                    </Router>
                </ThemeProvider>
            </HelmetProvider>
        </Provider>
    );
};

export default Root;
