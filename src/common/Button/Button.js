import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const StyleContainer = styled.div`
    margin: auto 0;

    --text-dark: #000000;
    --text-dark-hover: #000000;
    --text-white: #ffffff;
    --text-light-hover: #ffffff;
    --primary-color: #99bdff;
    --primary-color-hover: #456cb5;
    --secondary-color: #ffffff;
    --secondary-color-hover: #e6e6e6;
    --success-color: #76e02b;
    --success-color-hover: #60a331;
    --danger-color: #ff6e6e;
    --danger-color-hover: #b54545;
    --warning-color: #f2f241;
    --warning-color-hover: #99993a;
      
      .btn {
        padding: 0.5em 1em;
        font-size: 15px;
        border: none;
        box-shadow: 0 0 2px var(--text-dark);
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      
      .btn:focus {
        outline: 0;
      }
      
      .btn:active {
        transform: scale(0.97);
      }
      
      .btn--primary {
        color: var(--text-light);
        background-color: var(--primary-color);
      }
      
      .btn--primary:hover {
        color: var(--text-light-hover);
        background-color: var(--primary-color-hover);
      }
      
      .btn--secondary {
        color: var(--text-dark);
        background-color: var(--secondary-color);
      }
      
      .btn--secondary:hover {
        color: var(--text-dark-hover);
        background-color: var(--secondary-color-hover);
      }
      
      .btn--success {
        color: var(--text-light);
        background-color: var(--success-color);
      }
      
      .btn--success:hover {
        color: var(--text-light-hover);
        background-color: var(--success-color-hover);
      }
      
      .btn--danger {
        color: var(--text-light);
        background-color: var(--danger-color);
      }
      
      .btn--danger:hover {
        color: var(--text-light-hover);
        background-color: var(--danger-color-hover);
      }
      
      .btn--warning {
        color: var(--text-light);
        background-color: var(--warning-color);
      }
      
      .btn--warning:hover {
        color: var(--text-light-hover);
        background-color: var(--warning-color-hover);
      }
`;


export default function Button(props) {
    return (
        <StyleContainer>
            <button className={`btn btn--${props.type} btn--${props.size} ${props.block ? 'btn-block' : ''}`}>
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