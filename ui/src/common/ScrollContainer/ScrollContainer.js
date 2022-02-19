import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ScrollableContainer = styled.div`
    overflow-y: auto;
    overflow-x: hidden;
`;

export default function ScrollContainer (props) {
    const { children, style } = props;

    return (
        <ScrollableContainer style={style}>
            {children}
        </ScrollableContainer>
    );
}

ScrollContainer.propTypes = {
    style: PropTypes.object.isRequired,
    children: PropTypes.any.isRequired
};
