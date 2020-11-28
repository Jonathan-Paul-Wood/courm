import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import icons from '../../assets/icons/bootstrapIcons';

const StyleContainer = styled.div`
    margin: auto 0;

    --text-dark: #000000;
    --text-dark-hover: #000000;
    --text-white: #ffffff;
    --text-light-hover: #ffffff;
    --primary-color: #4da6ff;
    --primary-color-hover: #0066cc;
    --secondary-color: #ffffff;
    --secondary-color-hover: #e6e6e6;
    --success-color: #00ff00;
    --success-color-hover: #00e600;
    --danger-color: #ff3333;
    --danger-color-hover: #e63900;
    --warning-color: #ffff4d;
    --warning-color-hover: #e6e619;
      
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

      svg {
        margin: auto 0.5rem auto 0;
      }
`;


export default function Button(props) {
    return (
        <StyleContainer>
            <button className={`btn btn--${props.type} btn--${props.size} ${props.block ? 'btn-block' : ''}`}>
                {icons[props.icon]}
                {props.label}
            </button>
        </StyleContainer>
    );
}

Button.defaultProps = {
    type: 'primary',
    size: 'md',
    block: false,
    icon: '',
}

Button.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    block: PropTypes.bool,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
}