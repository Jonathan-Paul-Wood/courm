import React, { useEffect } from 'react';
import { Switch, Redirect } from 'react-router-dom';

// import { PropTypes } from 'prop-types';
import AppLayout from '../../../layouts/AppLayout/AppLayout';
import AppHome from '../../../components/AppHome';
import ContactsBrowse from '../../../components/ContactsBrowse';
import ViewContact from '../../../components/ViewContact';
import EditContact from '../../../components/EditContact';
import AppConfigure from '../../../components/AppConfigure';
import FaqHome from '../../../components/FaqHome';

export default function AppRouter () {
    useEffect(() => {
        document.title = 'Personal CRM';
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
                <AppLayout path="/configure" component={AppConfigure} {...commonRouteProps} />
                <AppLayout path="/faq" component={FaqHome} {...commonRouteProps} />
                {/* <AppLayout path="/interactions/:interactionsId" component={Interaction} />
                <AppLayout path="/interactions" component={InteractionsBrowse} /> */}
            </Switch>
        </React.Fragment>
    );
}
