import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CardWrapper = styled.div`
    height: 50px;
    background: #f2f2f2;
    border-radius: 4px;
    box-shadow: 2px 3px 2px #cccccc;
    margin: 0.5rem;
    padding: 0.5rem;
    display: flex;
    justify-content: center;
`;

export default function ContactCard(props) {
    const { name } = props;

    return (
        <CardWrapper>
            {name}
        </CardWrapper>
    );
}

ContactCard.propTypes = {
    name: PropTypes.string.isRequired,
}