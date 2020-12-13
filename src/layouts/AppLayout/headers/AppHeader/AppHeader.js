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
    margin: auto 0rem;
    padding: 0.5rem;
    color: white;
    z-index: 1000;
    cursor: default;
`;

const LogoContainer = styled.div`
    display: flex;
    width: 15vw;

    h3 {
        margin: auto 0rem;
        align-content: center;
        
        a {
            cursor: pointer;
        }
    }
`;

const PipeSeparator = styled.div`
    display: flex;
    font-size: 2rem;
    justify-content: center;
    align-content: center;
    margin: auto 0.5rem;
`;

const RightHeaderWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-content: center;
    margin: auto 0.5rem auto 60vw;
    h2 {
        display: flex;
        justify-content: center;
        align-content: center;
        margin: auto;
        cursor: pointer;
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
                <PipeSeparator>|</PipeSeparator>
            </LogoContainer>
            <RightHeaderWrapper> 
                <PipeSeparator>|</PipeSeparator>
                <h2>Help</h2>
                <PipeSeparator>|</PipeSeparator>
                <h2>Support</h2>
            </RightHeaderWrapper>
        </HeaderWrapper>
    );
}