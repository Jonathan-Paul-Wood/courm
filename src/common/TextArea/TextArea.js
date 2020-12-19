import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const StyleContainer = styled.div`
    min-height: 10em;

    textarea {
        height: 100%;
        width: 100%;
        position: relative;
        color: green;
    }

    textarea:invalid {
        border: 2px red;
    }

    textarea:valid {
        border: 2px solid line;
    }

    .error {
        color: red;
    }
`;


export default function TextArea(props) {
    const { placeholder, value, onChange, error, label, locked, max, min, required, secondary } = props;

    const fieldClassName = ``;

    return (
        <StyleContainer>
            <div className={fieldClassName}>
                <textarea
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    maxlength={max}
                    required={required}
                    minlength={{min}}
                    readonly={locked}
                    resize="none"
                />
                <label className={error ? "error" : ''}>
                    {error || label}
                </label>
            </div>
        </StyleContainer>
    );
}

TextArea.defaultProps = {
    placeholder: '',
    error: '',
    locked: false,
    secondary: false, //by default (for white backgrounds)
}

TextArea.propTypes = {
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    locked: PropTypes.bool,
    secondary: PropTypes.bool, //if true, will be white/transparent (for colored backgrounds)
}