import React from 'react';
import ReactDOM from 'react-dom';
import App from './common/App';
import { Provider } from 'react-redux';
import store from './configureStore';
import { createBrowserHistory } from 'history';
import { Router, Switch, Route } from 'react-router-dom';
import './styles/index.scss';
//import PageNotFound from './components/pages/PageNotFound';
//import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    <Provider store={store}>
      <Switch>
        <Route path="/home" component={App} />
        <Route exact path="/" component={App} />
        <Route path="/contacts/:contactId" component={App} />
        <Route path="/contacts" component={App} />
        <Route path="/interactions/:interactionId" component={App} />
        <Route path="/interactions" component={App} />
        {/* <Route path="/statistics" component={App} /> */}
        {/* <Route component={PageNotFound} /> */}
      </Switch>
    </Provider>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
