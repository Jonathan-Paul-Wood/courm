import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';

const StyledSelect = styled.select`
    align-content: center;
    display: inline-block;
    width: 100%;
    cursor: pointer;

    .select-disabled {
        transform: scale(1) !important; /*override active class*/
        background-color: #e6e6e6 !important;
        cursor: not-allowed;
        color: var(--text-dark) !important;
    }
    .select-disabled:hover {
        background-color: #e6e6e6 !important;
        color: var(--text-dark-hover) !important;
    }
`;

export default function Select (props) {
    const { type, size, block, options, selectedIndex, onSelect, disabled, isPending } = props;

    const [showPopup, setPopup] = useState(false);

    function handleSelection (val) {
        const value = val.target.selectedIndex;
        if (value >= 0) {
            onSelect(value);
        }
    }

    return (
        <Manager>
            <Reference>
                {({ ref }) => (
                    <span
                        className="reference-element"
                        ref={ref}
                        onClick={() => {
                            setPopup(!showPopup);
                        }}
                    >
                        <StyledSelect
                            className={`select select--${type} select--${size} ${block ? 'select-block' : ''} ${disabled ? 'select-disabled' : ''}`}
                            onChange={(val) => handleSelection(val)}
                            disabled={disabled || isPending}
                            value={selectedIndex}
                        >
                            <Popper placement="bottom">
                                {() => (
                                    options.map((option, index) => {
                                        return (
                                            <option display={showPopup ? 'visible' : 'hidden'} key={index} value={index}>{option.label}</option>
                                        );
                                    })
                                )}
                            </Popper>
                        </StyledSelect>
                    </span>
                )}
            </Reference>
        </Manager>
    );
}

Select.defaultProps = {
    type: 'primary',
    size: 'md',
    block: false,
    disabled: false,
    isPending: false
};

Select.propTypes = {
    type: PropTypes.string,
    size: PropTypes.string,
    block: PropTypes.bool,
    options: PropTypes.array.isRequired,
    selectedIndex: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    isPending: PropTypes.bool
};
