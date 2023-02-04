import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import '../../../node_modules/bootstrap/scss/bootstrap.scss';
import axiosSingleton from '../../configs/axiosSingleton';
import LoadingLoop from '../LoadingLoop/LoadingLoop';
import ToastWrapper from './ToastWrapper';
import AppHome from '../../components/AppHome';
import ContactsBrowse from '../../components/ContactsBrowse';
import ViewContact from '../../components/ViewContact';
import EditContact from '../../components/EditContact';
import EventsBrowse from '../../components/EventsBrowse';
import ViewEvent from '../../components/ViewEvent';
import EditEvent from '../../components/EditEvent';
import NotesBrowse from '../../components/NotesBrowse';
import ViewNote from '../../components/ViewNote';
import EditNote from '../../components/EditNote';
import AppConfigure from '../../components/AppConfigure';
import FaqHome from '../../components/FaqHome';
import LeftSidebar from '../../layouts/AppLayout/LeftSideBar/LeftSideBar';

const ErrorBoundary = styled.div`
`;// todo: make it's own component. Wraps around and overlays screen if there is an error message

const AppWrapper = styled.div`
    background-color: #ffffff;

    .content {
        position: relative;
        left: 8em;
        padding: 1em 0em;
        width: calc(100% - 10em);
    }
`;

export default function App () {
    const [isSetupComplete, setIsSetupComplete] = useState(false);

    useEffect(() => {
        axiosSingleton.request();
        setIsSetupComplete(true);
    }, []);

    return isSetupComplete
        ? (<div>
            <ErrorBoundary>
                <AppWrapper>
                    <LeftSidebar />
                    <div className="content">
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" replace /> } />
                            <Route path="home" element={<AppHome />} />
                            <Route path="contacts/*">
                                <Route path="" exact element={<ContactsBrowse />} />
                                <Route path="new" exact element={<EditContact />} />
                                <Route path=":contactId" element={<ViewContact />} />
                                <Route path=":contactId/edit" element={<EditContact />} />
                            </Route>
                            <Route path="events" exact element={<EventsBrowse />} />
                            <Route path="events/new" exact element={<EditEvent />} />
                            <Route path="events/:eventId/edit" element={<EditEvent />} />
                            <Route path="events/:eventId" element={<ViewEvent />} />
                            <Route path="/notes" exact element={<NotesBrowse />} />
                            <Route path="/notes/new" exact element={<EditNote />} />
                            <Route path="/notes/:noteId/edit" element={<EditNote />} />
                            <Route path="/notes/:noteId" element={<ViewNote />} />
                            <Route path="configure" element={<AppConfigure />} />
                            <Route path="faq" element={<FaqHome />} />
                            <Route path="*" element={<Navigate to="/home" replace /> } />
                        </Routes>
                        <div id="layout-footer"></div>
                    </div>
                </AppWrapper>
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
