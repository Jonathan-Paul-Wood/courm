import React, { useEffect } from 'react';
import { Switch, Redirect } from 'react-router-dom';

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
    useEffect(() => {
        document.title = 'Personal CRM'; //todo: move this to index file
    }, []);

    const commonRouteProps = {
        showWarning: false
    };

    return (
        <React.Fragment>
            <Switch>
                <Redirect exact from="/" to="/home" />
                <AppLayout path="/home" component={AppHome} {...commonRouteProps} />
                <AppLayout path="/contacts" exact component={ContactsBrowse} {...commonRouteProps} />
                <AppLayout path="/contacts/new" exact component={EditContact} {...commonRouteProps} />
                <AppLayout path="/contacts/:contactId/edit" component={EditContact} {...commonRouteProps} />
                <AppLayout path="/contacts/:contactId" component={ViewContact} {...commonRouteProps} />
                <AppLayout path="/events" exact component={EventsBrowse} {...commonRouteProps} />
                <AppLayout path="/events/new" exact component={EditEvent} {...commonRouteProps} />
                <AppLayout path="/events/:eventId/edit" component={EditEvent} {...commonRouteProps} />
                <AppLayout path="/events/:eventId" component={ViewEvent} {...commonRouteProps} />
                <AppLayout path="/notes" exact component={NotesBrowse} {...commonRouteProps} />
                <AppLayout path="/notes/new" exact component={EditNote} {...commonRouteProps} />
                <AppLayout path="/notes/:noteId/edit" component={EditNote} {...commonRouteProps} />
                <AppLayout path="/notes/:noteId" component={ViewNote} {...commonRouteProps} />
                <AppLayout path="/configure" component={AppConfigure} {...commonRouteProps} />
                <AppLayout path="/faq" component={FaqHome} {...commonRouteProps} />
                {/* <AppLayout path="/interactions/:interactionsId" component={Interaction} />
                <AppLayout path="/interactions" component={InteractionsBrowse} /> */}
            </Switch>
        </React.Fragment>
    );
}
