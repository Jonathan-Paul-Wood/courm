import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ScrollableContainer = styled.div`
    overflow-y: auto;
`;

export default function ScrollContainer (props) {
    const { height, width, children } = props;

    return (
        <ScrollableContainer style={{ height, width }}>
            {children}
        </ScrollableContainer>
    );
}

ScrollContainer.propTypes = {
    height: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    children: PropTypes.any.isRequired
};
