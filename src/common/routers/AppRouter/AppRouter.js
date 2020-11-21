import React, { useEffect, useState } from 'react';
import { Switch, Redirect, useParams, useHistory } from 'react-router-dom';
import Cookies from 'js-cookie';
import styled from 'styled-components';

import { PropTypes } from 'prop-types';
import axiosSingleton from '../../configs/axiosSingleton';

import AppLayout from '../../layouts/AppLayout/AppLayout';

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

    return props.appData ? (
        <React.Fragment>
            <Switch>
                {/*Redirect (exact) from="" to="" as needed*/}
                {/*AppLayout path (exact) component as needed*/}
            </Switch>
            {
                showAccessWarning && (
                    {/* CommonModal */}
                )
            }
        </React.Fragment>
    ) : (
        <LoadingContainer>
            {/*LoadingSpinner*/}
        </LoadingContainer>
    )
}

AdminRouter.PropTypes = {
    appData: PropTypes.object.isRequired,
}