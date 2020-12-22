import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import AppHeader from '../../layouts/AppLayout/headers/AppHeader/AppHeader';
import LeftSidebar from '../../layouts/AppLayout/LeftSideBar/LeftSideBar';

const AppWrapper = styled.div`
    background-color: #ffffff;

    .content {
        position: relative;
        top: 4em;
        left: 8em;
        padding: 1em;
        width: calc(100% - 10em);
    }
`;
 
export default function AppLayout({component: Component, ...props}) {
    return (
    <Route
        {...props}
        render={matchProps => (
            <AppWrapper>
                <AppHeader />
                <LeftSidebar />
                <div className="content">
                    <Component {...matchProps} />
                    <div id="layout-footer"></div>
                </div>
            </AppWrapper>
        )}
    />
)
}