import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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

.secondary-field textarea {
    overflow: hidden;
    text-overflow: ellipsis;
    width: calc(100% - 32px); //tied to left+right padding
    min-height: 6em;
    position: relative;
    padding: 1em 1em 0.5em 1em;
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

.secondary-field textarea::-webkit-textarea-placeholder {
    color: rgba(255, 255, 255, 0.8);
}
.secondary-field textarea::-moz-placeholder {
    color: rgba(255, 255, 255, 0.8);
}
.secondary-field textarea:-ms-textarea-placeholder {
    color: rgba(255, 255, 255, 0.8);
}
.secondary-field textarea:-moz-placeholder {
    color: rgba(255, 255, 255, 0.8);
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

.field textarea {
    resize: none;
    overflow: hidden;
    text-overflow: ellipsis;
    width: calc(100% - 32px); //tied to left+right padding
    min-height: 6em;
    position: relative;
    padding: 1em 1em 0.5em 1em;
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

.field textarea::-webkit-textarea-placeholder {
    color: #a6a6a6;
}
.field textarea::-moz-placeholder {
    color: #a6a6a6;
}
.field textarea:-ms-textarea-placeholder {
    color: #a6a6a6;
}
.field textarea:-moz-placeholder {
    color: #a6a6a6;
}

textarea + label {
    position: absolute;
    left: 16px;
    top: -4px;
    font-size: 12px;
    font-weight: 600;
    line-height: 24px;
    opacity: 1;
    color: #512da8;
    pointer-events: none;
}

textarea + label.error {
    color: red;
}
`;

export default function TextArea (props) {
    const { placeholder, value, onChange, error, label, locked, max, required, secondary } = props;
    const [active, setActive] = useState(false);

    const fieldClassName = `${secondary ? 'secondary-field' : 'field'} ${active ? 'active' : ''}`;
    return (
        <StyleContainer>
            <div className={fieldClassName}>
                <textarea
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    maxLength={max}
                    required={required}
                    readOnly={locked}
                    onFocus={() => !locked && setActive(true)}
                    onBlur={() => !locked && setActive(false)}
                    resize="none"
                />
                <label className={error ? 'error' : ''}>
                    {error || label}
                </label>
            </div>
        </StyleContainer>
    );
}

TextArea.defaultProps = {
    placeholder: '',
    value: '',
    error: '',
    locked: false,
    secondary: false, // by default (for white backgrounds)
    max: 140,
    onChange: () => {},
    onEnter: () => {},
    required: false
};

TextArea.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string,
    label: PropTypes.string.isRequired,
    error: PropTypes.string,
    locked: PropTypes.bool,
    secondary: PropTypes.bool, // if true, will be white/transparent (for colored backgrounds)
    max: PropTypes.number,
    onEnter: PropTypes.func,
    onChange: PropTypes.func,
    required: PropTypes.bool
};
