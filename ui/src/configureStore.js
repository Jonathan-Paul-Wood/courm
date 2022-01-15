import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import reduxLogger from 'redux-logger';
import reduxThunk from 'redux-thunk';
import contact from './store/Contact/reducer';
import contactList from './store/ContactList/reducer';
import note from './store/Note/reducer';
import noteList from './store/NoteList/reducer';
import configure from './store/Configure/reducer';
import relation from './store/Relation/reducer';
import relationList from './store/RelationList/reducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    contact,
    contactList,
    note,
    noteList,
    configure,
    relation,
    relationList
});

const middlewares = applyMiddleware(reduxThunk, reduxLogger);

const store = createStore(rootReducer, composeEnhancers(middlewares));

export default store;
