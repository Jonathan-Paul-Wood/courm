import React, { useEffect, useState } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import { Switch, Redirect } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import '../../../node_modules/bootstrap/scss/bootstrap.scss';
import axiosSingleton from '../../configs/axiosSingleton';
import AppRouter from '../routers/AppRouter/AppRouter';
import LoadingLoop from '../LoadingLoop/LoadingLoop';

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
                <Switch>
                    <Redirect exact from="/" to="home" />
                    <AppRouter path="/home" component={AppRouter} />
                    <AppRouter path="/contacts/:contactId" component={AppRouter} />
                    <AppRouter path="/contacts/new" component={AppRouter} />
                    <AppRouter path="/contacts" component={AppRouter} />
                    <AppRouter path="/events/:contactId" component={AppRouter} />
                    <AppRouter path="/events/new" component={AppRouter} />
                    <AppRouter path="/events" component={AppRouter} />
                    <AppRouter path="/notes/:noteId" component={AppRouter} />
                    <AppRouter path="/notes/new" component={AppRouter} />
                    <AppRouter path="/notes" component={AppRouter} />
                    <AppRouter path="/configure" component={AppRouter} />
                    <AppRouter path="/faq" component={AppRouter} />
                    {/* <Route exact path="/statistics" component={App} /> */}
                </Switch>
            </ErrorBoundary>

            <ToastContainer
                hideProgressBar={true}
                position={toast.POSITION.TOP_RIGHT}
                transition={Slide}
                autoClose={2000}
            />

            {/* <ConfirmModal

            />
            <UnsavedChangesModal /> */}
        </div>)
        : (
            <LoadingLoop type='spinner' styleGroup='primary' />
        ); // todo: make loading spinner
}
