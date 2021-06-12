import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import LeftSidebar from '../../layouts/AppLayout/LeftSideBar/LeftSideBar';

const AppWrapper = styled.div`
    background-color: #ffffff;

    .content {
        position: relative;
        left: 8em;
        padding: 1em 0em;
        width: calc(100% - 10em);
    }
`;
 
export default function AppLayout({component: Component, ...props}) {
    return (
    <Route
        {...props}
        render={matchProps => (
            <AppWrapper>
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