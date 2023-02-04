import React from 'react';
import { Routes } from 'react-router-dom';

// import { PropTypes } from 'prop-types';
import AppLayout from '../../../layouts/AppLayout/AppLayout';
import AppHome from '../../../components/AppHome';
import ContactsBrowse from '../../../components/ContactsBrowse';
import ViewContact from '../../../components/ViewContact';
import EditContact from '../../../components/EditContact';
import EventsBrowse from '../../../components/EventsBrowse';
import ViewEvent from '../../../components/ViewEvent';
import EditEvent from '../../../components/EditEvent';
import NotesBrowse from '../../../components/NotesBrowse';
import ViewNote from '../../../components/ViewNote';
import EditNote from '../../../components/EditNote';
import AppConfigure from '../../../components/AppConfigure';
import FaqHome from '../../../components/FaqHome';

export default function AppRouter () {
    const commonRouteProps = {
        showWarning: false
    };

    return (
        <React.Fragment>
            <Routes>
                <AppLayout path="/" element={<AppHome />} {...commonRouteProps} />
                <AppLayout path="/home" element={<AppHome />} {...commonRouteProps} />
                <AppLayout path="/contacts" exact element={<ContactsBrowse />} {...commonRouteProps} />
                <AppLayout path="/contacts/new" exact element={<EditContact />} {...commonRouteProps} />
                <AppLayout path="/contacts/:contactId/edit" element={<EditContact />} {...commonRouteProps} />
                <AppLayout path="/contacts/:contactId" element={<ViewContact />} {...commonRouteProps} />
                <AppLayout path="/events" exact element={<EventsBrowse />} {...commonRouteProps} />
                <AppLayout path="/events/new" exact element={<EditEvent />} {...commonRouteProps} />
                <AppLayout path="/events/:eventId/edit" element={<EditEvent />} {...commonRouteProps} />
                <AppLayout path="/events/:eventId" element={<ViewEvent />} {...commonRouteProps} />
                <AppLayout path="/notes" exact element={<NotesBrowse />} {...commonRouteProps} />
                <AppLayout path="/notes/new" exact element={<EditNote />} {...commonRouteProps} />
                <AppLayout path="/notes/:noteId/edit" element={<EditNote />} {...commonRouteProps} />
                <AppLayout path="/notes/:noteId" element={<ViewNote />} {...commonRouteProps} />
                <AppLayout path="/configure" element={<AppConfigure />} {...commonRouteProps} />
                <AppLayout path="/faq" element={<FaqHome />} {...commonRouteProps} />
                {/* <AppLayout path="/interactions/:interactionsId" element={<Interaction />} />
                <AppLayout path="/interactions" element={<InteractionsBrowse />} /> */}
            </Routes>
        </React.Fragment>
    );
}
