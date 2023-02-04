import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './common/App';
import { Provider } from 'react-redux';
import store from './configureStore';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './styles/index.scss';
// import PageNotFound from './components/pages/PageNotFound';

const container = document.getElementById('root');
const root = createRoot(container);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="*" element={<App />} />
    )
);

root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
