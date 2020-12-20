import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
 
import "react-datepicker/dist/react-datepicker.css";


const StyleContainer = styled.div`
    width: 100%;

    .secondary-field {
        width: 100%;
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

    .secondary-field.locked {
        pointer-events: none;
    }

    .secondary-field input {
        width: 100%;
        min-height: 56px;
        position: relative;
        padding: 24px 16px 8px 16px;
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
        left: 16px;
        font-size: 12px;
        font-weight: 600;
        line-height: 24px;
        top: 4px;
        opacity: 1;
        color: #512da8;
        pointer-events: none;
    }

    .field {
        width: 100%;
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
    .field.locked {
        pointer-events: none;
    }

    .field input {
        width: 100%;
        min-height: 56px;
        position: relative;
        padding: 14px 16px 8px 16px;
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
        left: 16px;
        font-size: 12px;
        font-weight: 600;
        line-height: 24px;
        top: 4px;
        opacity: 1;
        color: #512da8;
        pointer-events: none;
    }

    input + label.error {
        color: red;
    }
`;


export default function Input(props) {
    const { placeholder, value, onChange, error, label, locked, secondary, height, isDate } = props;
    const [active, setActive] = useState(false);

    const fieldClassName = `${secondary ? 'secondary-field' : 'field'} ${active ? "active" : ''} ${(locked && !active) ? "locked" : ''}`;

    return (
        <StyleContainer className="input-field">
            <div className={fieldClassName} style={{height: `${height}`}}>
                {isDate ? (
                    <DatePicker
                        selected={(value && value !== "null") ? new Date(value) : new Date()}
                        onChange={date => onChange(date)}
                        onClickOutside={() => {}}
                        showYearDropdown={true}
                        showMonthDropdown={true}
                    />
                ) : (
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onFocus={() => !locked && setActive(true)}
                        onBlur={() => !locked && setActive(false)} //TODO: make break up active so cell only highlighted when selected, but label shows when selected OR !!value
                    />
                )}
                <label className={error ? "error" : ''}>
                    {error || label}
                </label>
            </div>
        </StyleContainer>
    );
}

Input.defaultProps = {
    placeholder: '',
    value: '',
    error: '',
    locked: false,
    secondary: false, //by default (for white backgrounds)
    height: '56px',
    maxLength: 140,
    isDate: false,
    onChange: () => {},
}

Input.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    error: PropTypes.string,
    locked: PropTypes.bool,
    secondary: PropTypes.bool, //if true, will be white/transparent (for colored backgrounds)
    height: PropTypes.string,
    maxLength: PropTypes.number,
    isDate: PropTypes.bool
}