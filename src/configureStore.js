import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import reduxLogger from 'redux-logger';
import reduxThunk from 'redux-thunk';
import example from './store/Error/reducer';
import contact from './store/Contact/reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    example,
    contact,
});

const middlewares = applyMiddleware(reduxThunk, reduxLogger);

const store = createStore(rootReducer, composeEnhancers(middlewares));

export default store;