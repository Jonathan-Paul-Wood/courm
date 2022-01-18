import React from 'react';
import ReactDOM from 'react-dom';
import App from './common/App';
import { Provider } from 'react-redux';
import store from './configureStore';
import { createBrowserHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import './styles/index.scss';
// import PageNotFound from './components/pages/PageNotFound';

ReactDOM.render(
    <Router history={createBrowserHistory()}>
        <Provider store={store}>
            <Switch>
                <Route path="/home" component={App} />
                <Route exact path="/" component={App} />
                <Route path="/contacts" component={App} />
                <Route path="/contacts/new" component={App} />
                <Route path="/contacts/:contactId" component={App} />
                <Route path="/events" component={App} />
                <Route path="/events/new" component={App} />
                <Route path="/events/:contactId" component={App} />
                <Route path="/notes" component={App} />
                <Route path="/notes/new" component={App} />
                <Route path="/notes/:noteId" component={App} />
                <Route path="/configure" component={App} />
                <Route path="/faq" component={App} />
                {/* <Route path="/statistics" component={App} /> */}
                {/* <Route component={PageNotFound} /> */}
            </Switch>
        </Provider>
    </Router>,
    document.getElementById('root')
);
