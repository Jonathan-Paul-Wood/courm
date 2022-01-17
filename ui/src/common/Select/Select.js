import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Manager, Reference, Popper } from 'react-popper';
import { BLACK, WHITE, GREY } from '../../assets/colorsConstants';

const SelectWrapper = styled(Manager)`
    margin: 1em 0;
    border-radius: 0.5em;
    align-content: center;
    display: inline-block;
    width: 100%;

    --text-dark: ${BLACK};
    --text-dark-hover: ${BLACK};
    --secondary-color: ${WHITE};
    --secondary-color-hover: ${GREY};
    
    .select {
        padding: 0.5em 1em;
        border: none;
        box-shadow: 0 0 2px var(--text-dark);
        cursor: pointer;
        transition: background-color 0.2s ease;
        width: 100%;
        display: inline-block;
        line-height: 1.5;
    }
    
    .select:focus {
        outline: 0;
    }
    
    .select:active {
        transform: scale(0.97);
    }

    .select--secondary {
        color: var(--text-dark);
        background-color: var(--secondary-color);
    }
    
    .select--secondary:hover {
        color: var(--text-dark-hover);
        background-color: var(--secondary-color-hover);
    }

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
        <SelectWrapper>
            <Reference>
                {({ ref }) => (
                    <span
                        className="reference-element"
                        ref={ref}
                        onClick={() => {
                            setPopup(!showPopup);
                        }}
                    >
                        <select
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
                        </select>
                    </span>
                )}
            </Reference>
        </SelectWrapper>
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
