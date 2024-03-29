import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import icons from '../../assets/icons/bootstrapIcons';
import LoadingLoop from '../LoadingLoop/LoadingLoop';
import { BLACK, WHITE, PRIMARY, PRIMARY_FOCUS, GREY, SUCCESS, SUCCESS_FOCUS, ERROR, ERROR_FOCUS, WARNING, WARNING_FOCUS } from '../../assets/colorsConstants';

const StyleContainer = styled.div`
    margin: auto 0;
    align-content: center;

    --text-dark: ${BLACK};
    --text-dark-hover: ${BLACK};
    --text-white: ${WHITE};
    --text-light-hover: ${WHITE};
    --primary-color: ${PRIMARY};
    --primary-color-hover: ${PRIMARY_FOCUS};
    --secondary-color: ${WHITE};
    --secondary-color-hover: ${GREY};
    --success-color: ${SUCCESS};
    --success-color-hover: ${SUCCESS_FOCUS};
    --danger-color: ${ERROR};
    --danger-color-hover: ${ERROR_FOCUS};
    --warning-color: ${WARNING};
    --warning-color-hover: ${WARNING_FOCUS};
      
      .btn {
        display: flex;
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

      .btn-disabled {
        transform: scale(1) !important; /*override active class*/
        background-color: #e6e6e6 !important;
        cursor: not-allowed;
        color: var(--text-dark) !important;
      }
      .btn-disabled:hover {
        background-color: #e6e6e6 !important;
        color: var(--text-dark-hover) !important;
      }

      svg {
        margin: auto 0.5rem auto 0;
      }

      span {
        position: relative:
      }
`;

export default function Button (props) {
    const { type, size, block, icon, label, onClick, disabled, isPending } = props;
    return (
        <StyleContainer>
            <button
                className={`btn btn--${type} btn--${size} ${block ? 'btn-block' : ''} ${disabled ? 'btn-disabled' : ''}`}
                onClick={onClick}
                disabled={disabled || isPending}
            >
                {isPending
                    ? (
                        <LoadingLoop
                            styleGroup='primary'
                            size={size}
                        />
                    )
                    : (
                        <>
                            {icons[icon]}
                        </>
                    )}
                <span>{label}</span>
            </button>
        </StyleContainer>
    );
}

Button.defaultProps = {
    type: 'primary',
    size: 'md',
    block: false,
    icon: '',
    disabled: false,
    isPending: false
};

Button.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    block: PropTypes.bool,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isPending: PropTypes.bool
};
