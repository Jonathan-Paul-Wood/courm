import React, { useEffect, useState } from 'react';
import { Switch, Redirect, useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

// import { PropTypes } from 'prop-types';
import AppLayout from '../../../layouts/AppLayout/AppLayout';
import AppHome from '../../../components/AppHome/AppHome';
import ContactsBrowse from '../../../components/ContactsBrowse';
import ViewContact from '../../../components/ViewContact';
import EditContact from '../../../components/EditContact';
import AppConfigure from '../../../components/AppConfigure';

const LoadingContainer = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 40%;
`;

export default function AppRouter(props) {
    const [showAccessWarning, setShowAccessWarning] = useState(false);
    const history = useHistory();

    useEffect(() => {
        document.title = 'Personal CRM';
        //TODO: get appData
    }, []);

    /**
     * useEffect triggered on accessing an account/workspace or whatever, checks for access and redirects if needed
     */

    const commonRouteProps = {
        showWarning: setShowAccessWarning,
    }

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
                {/* <AppLayout path="/interactions/:interactionsId" component={Interaction} />
                <AppLayout path="/interactions" component={InteractionsBrowse} /> */}
            </Switch>
        </React.Fragment>
    )
    //change 'return' to 'return props.appData ?' ...  : (
    //     <LoadingContainer>
    //         {/*LoadingSpinner*/}
    //     </LoadingContainer>
    // )
}

// AppRouter.propTypes = {
//     appData: PropTypes.object.isRequired,
// }