import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import icons from '../../../../assets/icons/bootstrapIcons';

const ItemWrapper = styled.div`
    height: 100%;
    font-size: 1rem!important;
    border-bottom: 1px solid black;
    display: flex;
    position: relative;
    cursor: pointer;

    .nav-option:hover {
        opacity: 0.8;
    }
`;

const ItemContainer = styled.div`
    display: flex;
    margin: auto 0.5rem;
    width: calc(100% - 1rem);

    span {
        font-size: 0.5rem;
    }

    i {
        margin: auto 0.5rem auto 0;
    }

    svg {
        margin: auto 0.5rem auto 0;
    }
`;

export default function SideBarNavItem (props) {
    const navigate = useNavigate();

    function handleNavigation (path) {
        navigate(`${path}`);
    }

    return (
        <ItemWrapper onClick={() => handleNavigation(props.path)}>
            <ItemContainer className="nav-option">
                {icons[props.icon]}
                {props.title.toUpperCase()}
            </ItemContainer>
        </ItemWrapper>
    );
}

SideBarNavItem.propTypes = {
    path: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string
};
