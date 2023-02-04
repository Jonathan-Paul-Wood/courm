import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './common/App';
import { Provider } from 'react-redux';
import store from './configureStore';
import { createBrowserHistory } from 'history';
import { Router, Routes, Route } from 'react-router-dom';
import './styles/index.scss';
// import PageNotFound from './components/pages/PageNotFound';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Router navigator={createBrowserHistory()}>
        <Provider store={store}>
            <Routes>
                <Route path="/home" element={<App />} />
                <Route path="/" element={<App />} />
                <Route path="/contacts" element={<App />} />
                <Route path="/contacts/new" element={<App />} />
                <Route path="/contacts/:contactId" element={<App />} />
                <Route path="/events" element={<App />} />
                <Route path="/events/new" element={<App />} />
                <Route path="/events/:contactId" element={<App />} />
                <Route path="/notes" element={<App />} />
                <Route path="/notes/new" element={<App />} />
                <Route path="/notes/:noteId" element={<App />} />
                <Route path="/configure" element={<App />} />
                <Route path="/faq" element={<App />} />
                {/* <Route path="/statistics" element={<App />} /> */}
                {/* <Route element={<PageNotFound />} /> */}
            </Routes>
        </Provider>
    </Router>
);
