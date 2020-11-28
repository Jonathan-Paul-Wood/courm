import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const ItemWrapper = styled.div`
    width: 8rem;
    height: 5rem;
    font-size: 1.2rem;
    margin: 0.2rem;
    border-bottom: 1px solid black;
    display: flex;
    position: relative;
`;

const ItemContainer = styled.div`
    display: flex;
    margin: auto;

    span {
        font-size: 0.5rem;
    }
`;

export default function LeftSidebar(props) {
    const history = useHistory();

    function handleNavigation(path) {
        history.push(`/${path}`);
    }

    return (
        <ItemWrapper>
            <ItemContainer onClick={() => handleNavigation(props.path)}>
                <span>{props.icon}</span>
                {props.title.toUpperCase()}
            </ItemContainer>
        </ItemWrapper>
    );
}