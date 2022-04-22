import {
    Store,
    createStore,
    applyMiddleware,
    compose,
    combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';

import { pollsReducer, initialPollsState } from 'store/polls/pollsReducer';
import { RootState } from 'store/types';
import { BUILD_TYPE } from 'constants/appConstants';

export const initialState = { polls: initialPollsState };

const { createReduxHistory, routerMiddleware, routerReducer } =
    createReduxHistoryContext({
        history: createBrowserHistory(),
    });
export const rootReducer = combineReducers({
    router: routerReducer,
    polls: pollsReducer,
});

const logger = createLogger({
    diff: true,
    collapsed: true,
});
const configureStoreDev = (): Store<RootState> => {
    const middleware = [thunk, logger, routerMiddleware];
    return createStore(
        rootReducer,
        initialState,
        composeWithDevTools(applyMiddleware(...middleware)),
    );
};
const configureStoreProd = (): Store<RootState> => {
    const middleware = [thunk, routerMiddleware];
    return createStore(
        rootReducer,
        initialState,
        compose(applyMiddleware(...middleware)),
    );
};
const configureStore =
    BUILD_TYPE === `production` ? configureStoreProd : configureStoreDev;

export const store = configureStore();
export const history = createReduxHistory(store);
