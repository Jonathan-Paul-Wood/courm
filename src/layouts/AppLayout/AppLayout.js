import React from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import AppHeader from '../../layouts/AppLayout/headers/AppHeader/AppHeader';

const AppWrapper = styled.div`
    background-color: #ffffff;
`;
 
export default function AppLayout({component: Component, ...props}) {
    return (
    <Route
        {...props}
        render={matchProps => (
            <AppWrapper>
                <AppHeader />
                <div>LeftSidebar</div>
                <div className="content">
                    <Component {...matchProps} />
                    <div>Footer</div>
                </div>
            </AppWrapper>
        )}
    />
)
}