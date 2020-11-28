import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const StyleContainer = styled.div`
    button {
        border-radius: 5px;
        text-transform: uppercase;
        padding: 0.5rem;
    }

    button:active{
        border: 1px solid #4dd0e1;
        box-shadow: 0 0 0 1px #4dd0e1;
    }

    
    button:hover{
        box-shadow: 0 0 0 1px #4dd0e1;
        cursor: pointer;
    }

    .btn-secondary {
        background-color: #ffffff;
    }
`;


export default function Button(props) {
    return (
        <StyleContainer>
            <button className={`btn btn-${props.type} btn-${props.size} ${props.block ? 'btn-block' : ''}`}>
                {props.label}
            </button>
        </StyleContainer>
    );
}

Button.defaultProps = {
    type: 'primary',
    size: 'md',
    block: false,
}

Button.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    block: PropTypes.bool,
    label: PropTypes.string.isRequired,
}