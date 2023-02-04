import React, { useEffect, useState } from 'react';
import { Routes } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import '../../../node_modules/bootstrap/scss/bootstrap.scss';
import axiosSingleton from '../../configs/axiosSingleton';
import AppRouter from '../routers/AppRouter/AppRouter';
import LoadingLoop from '../LoadingLoop/LoadingLoop';
import ToastWrapper from './ToastWrapper';

const ErrorBoundary = styled.div`
`;// todo: make it's own component. Wraps around and overlays screen if there is an error message

export default function App () {
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    useEffect(() => {
        axiosSingleton.request();
        setIsSetupComplete(true);
    }, []);
    return isSetupComplete
        ? (<div>
            <ErrorBoundary>
                <Routes>
                    <AppRouter path="/home" element={<AppRouter />} />
                    <AppRouter path="/contacts/:contactId" element={<AppRouter />} />
                    <AppRouter path="/contacts/new" element={<AppRouter />} />
                    <AppRouter path="/contacts" element={<AppRouter />} />
                    <AppRouter path="/events/:contactId" element={<AppRouter />} />
                    <AppRouter path="/events/new" element={<AppRouter />} />
                    <AppRouter path="/events" element={<AppRouter />} />
                    <AppRouter path="/notes/:noteId" element={<AppRouter />} />
                    <AppRouter path="/notes/new" element={<AppRouter />} />
                    <AppRouter path="/notes" element={<AppRouter />} />
                    <AppRouter path="/configure" element={<AppRouter />} />
                    <AppRouter path="/faq" element={<AppRouter />} />
                    {/* <Route path="/interactions/:interactionId" element={<App />} /> */}
                    {/* <Route path="/interactions" element={<App />} /> */}
                    {/* <Route exact path="/statistics" element={<App />} /> */}
                </Routes>
            </ErrorBoundary>
            <ToastWrapper />

            {/* <ConfirmModal

            />
            <UnsavedChangesModal /> */}
        </div>)
        : (
            <LoadingLoop type='spinner' styleGroup='primary' />
        ); // todo: make loading spinner
}
