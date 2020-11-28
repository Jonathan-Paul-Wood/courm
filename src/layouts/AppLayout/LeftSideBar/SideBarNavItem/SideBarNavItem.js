import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const ItemWrapper = styled.div`
    font-size: 1.2rem;
    border-bottom: 1px solid black;
    display: flex;
    position: relative;

    .nav-option {
        cursor: pointer;
    }

    .nav-option:hover {
        opacity: 0.8;
    }
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
        history.push(`${path}`);
    }

    return (
        <ItemWrapper>
            <ItemContainer className="nav-option" onClick={() => handleNavigation(props.path)}>
                <span>{props.icon}</span>
                {props.title.toUpperCase()}
            </ItemContainer>
        </ItemWrapper>
    );
}