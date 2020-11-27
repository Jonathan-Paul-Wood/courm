import React, { useEffect, useState } from 'react';
import { Switch, Redirect, useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { PropTypes } from 'prop-types';
import AppLayout from '../../../layouts/AppLayout/AppLayout';
import AppHome from '../../../components/AppHome/AppHome';
import ContactsBrowse from '../../../components/ContactsBrowse/ContactsBrowse';

const LoadingContainer = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 40%;
`;

const ErrorBoundary = styled.div`
`;//todo: make it's own component. Wraps around and overlays screen if there is an error message

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
            <ErrorBoundary>
                <Switch>
                    <Redirect exact from="/" to="/home" />
                    <AppLayout exact path="/home" component={AppHome} />
                    {/* <AppLayout path="/contacts/:contactsId" component={Contact} /> */}
                    <AppLayout path="/contacts" component={ContactsBrowse} />
                    {/* <AppLayout path="/interactions/:interactionsId" component={Interaction} />
                    <AppLayout path="/interactions" component={InteractionsBrowse} /> */}
                </Switch>
            </ErrorBoundary>
            {
                showAccessWarning && (
                    {/* CommonModal */}
                )
            }
        </React.Fragment>
    )
    //change 'return' to 'return props.appData ?' ...  : (
    //     <LoadingContainer>
    //         {/*LoadingSpinner*/}
    //     </LoadingContainer>
    // )
}

AppRouter.propTypes = {
    appData: PropTypes.object.isRequired,
}