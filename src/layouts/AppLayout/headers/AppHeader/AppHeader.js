import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.div`
    position: fixed;
    top: 0;
    width: 100%;
    height: 3em;
    display: flex;
    background-color: black;
`;

const LogoContainer = styled.div`
    display: flex;
    min-width: 10%;

    h3 {
        color: white;
    }
`;

export default function AppHeader() {
    const history = useHistory();

    function handleHomeNavigation() {
        history.push('/home');
    }

    return (
        <HeaderWrapper>
            <LogoContainer>
                <h3><a onClick={() => handleHomeNavigation()}>Personal CRM</a></h3>
            </LogoContainer>
        </HeaderWrapper>
    );
}