import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {routerMiddleware } from 'react-router-redux';
import {Router, Route, hashHistory,browserHistory} from 'react-router';

import reducers from '../reducers';

const routingMiddleware = routerMiddleware(hashHistory);

const logger = (store) => (next) => (action) => {
    if (typeof action !== "function") {
        console.log('dispatching:', action);
    }
    return next(action);
};

const middleware = applyMiddleware(routingMiddleware, thunk, logger);

const AppStore = createStore(
    reducers,
    middleware
);

export default AppStore;
