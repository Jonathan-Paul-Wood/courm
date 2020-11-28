import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const StyleContainer = styled.div`
    width: 100%;
    margin: 0 3em;

    .secondary-field {
        width: 100%;
        height: 56px;
        border-radius: 2px;
        position: relative;
        background-color: rgba(255, 255, 255, 0.3);
        transition: 0.3s background-color ease-in-out, 0.3s box-shadow ease-in-out;
    }
  
    .secondary-field:hover {
        background-color: rgba(255, 255, 255, 0.45);
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
    }
  
    .secondary-field.active {
        background-color: #ffffff;
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
    }

    .secondary-field.active input {
        padding: 24px 16px 8px 16px;
    }

    .secondary-field.active input + label {
        top: 4px;
        opacity: 1;
        color: #512da8;
    }

    .secondary-field.locked {
        pointer-events: none;
    }

    .secondary-field input {
        width: 100%;
        height: 56px;
        position: relative;
        padding: 0px 16px;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 400;
        line-height: normal;
        background-color: transparent;
        color: #282828;
        outline: none;
        box-shadow: 0px 4px 20px 0px transparent;
        transition: 0.3s background-color ease-in-out, 0.3s box-shadow ease-in-out,
            0.1s padding ease-in-out;
        -webkit-appearance: none;
    }

    .secondary-field input::-webkit-input-placeholder {
        color: rgba(255, 255, 255, 0.8);
    }
    .secondary-field input::-moz-placeholder {
        color: rgba(255, 255, 255, 0.8);
    }
    .secondary-field input:-ms-input-placeholder {
        color: rgba(255, 255, 255, 0.8);
    }
    .secondary-field input:-moz-placeholder {
        color: rgba(255, 255, 255, 0.8);
    }

    .secondary-field input + label {
        position: absolute;
        top: 24px;
        left: 16px;
        font-size: 12px;
        font-weight: 600;
        line-height: 24px;
        color: #ffffff;
        opacity: 0;
        pointer-events: none;
        transition: 0.1s all ease-in-out;
    }

    .field {
        width: 100%;
        height: 56px;
        border-radius: 2px;
        position: relative;
        background-color: #f2f2f2;
        transition: 0.3s background-color ease-in-out, 0.3s box-shadow ease-in-out;
    }
  
    .field:hover {
        background-color: rgba(255, 255, 255, 0.45);
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.05);
    }
  
    .field.active {
        background-color: #ffffff;
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
    }

    .field.active input {
        padding: 14px 16px 8px 16px;
    }

    .field.active input + label {
        top: 4px;
        opacity: 1;
        color: #512da8;
    }

    .field.locked {
        pointer-events: none;
    }

    .field input {
        width: 100%;
        height: 56px;
        position: relative;
        padding: 0px 8px;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 400;
        line-height: normal;
        background-color: transparent;
        color: #282828;
        outline: none;
        box-shadow: 0px 4px 20px 0px transparent;
        transition: 0.3s background-color ease-in-out, 0.3s box-shadow ease-in-out,
            0.1s padding ease-in-out;
        -webkit-appearance: none;
    }

    .field input::-webkit-input-placeholder {
        color: #a6a6a6;
    }
    .field input::-moz-placeholder {
        color: #a6a6a6;
    }
    .field input:-ms-input-placeholder {
        color: #a6a6a6;
    }
    .field input:-moz-placeholder {
        color: #a6a6a6;
    }

    .field input + label {
        position: absolute;
        top: 16px;
        left: 16px;
        font-size: 12px;
        font-weight: 600;
        line-height: 24px;
        color: #ffffff;
        opacity: 0;
        pointer-events: none;
        transition: 0.1s all ease-in-out;
    }

    input + label.error {
        color: red;
    }
`;


export default function Input(props) {
    const { placeholder, value, onChange, error, label, locked, secondary } = props;
    const [active, setActive] = useState(false);

    const fieldClassName = `${secondary ? 'secondary-field' : 'field'} ${active ? "active" : ''} ${(locked && !active) ? "locked" : ''}`;

    return (
        <StyleContainer>
            <div className={fieldClassName}>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => !locked && setActive(true)}
                    onBlur={() => !locked && setActive(false)}
                />
                <label className={error ? "error" : ''}>
                    {error || label}
                </label>
            </div>
        </StyleContainer>
    );
}

Input.defaultProps = {
    placeholder: '',
    error: '',
    locked: false,
    secondary: false, //by default (for white backgrounds)
}

Input.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    locked: PropTypes.bool,
    secondary: PropTypes.bool, //if true, will be white/transparent (for colored backgrounds)
}