import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PopoverContainer = styled.div`
background-color: #ffffff;
width: 20vw;
min-width: 275px;
max-height: 45vh;
min-height: 150px;
border: solid black 1px;
border-radius: 4px;
padding: 0 2.5%;

overflow-y: auto;
overflow-x: hidden;

#popover-header {
    border-bottom: solid black 1px;
    height: 1.25em;
    font-size: 1.25em;
    white-space: nowrap;
    text-overflow: ellipsis;
    justify-content: right;
}

#order-direction {
    margin: 0.5em 2.5%;
    display: flex;
    justify-content: space-around;
    border: 0.1em solid #e2e2e2;
    border-radius: 5px;
}

.activeDirection {
    width: 100%;
    text-align: center;
    cursor: default;
    color: white;
    background-color: #4da6ff;
    border-radius: 5px;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 0.5rem;
}
.inactiveDirection {
    width: 100%;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 0.5rem;
}
.inactiveDirection:hover {
    cursor: pointer;
    background-color: #f2f2f2;
}

`;

export default function FilterControls(props) {
    const { updateActiveFilters, activeFilters } = props;

    return (
        <PopoverContainer>
            <div id="popover-header" label="Filters">
                Filters
            </div>
            <div id="search-filters">
                <strong>Search on fields:</strong>
                <div id="search-field-list">
                    {activeFilters.map((field, index) => {
                        return (
                            <div key={index} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`checkbox-filter-${field.value}`}
                                    checked={field.selected}
                                    value={field.value}
                                    name="inputs"
                                    onChange={() => updateActiveFilters(index)}
                                />
                                <label className="form-check-label" for={`checkbox-filter-${field.value}`}>
                                    {field.label}
                                </label>
                            </div>
                        )
                    })}
                </div>
            </div>
        </PopoverContainer>
    )
}


FilterControls.propTypes = {
    updateActiveFilters: PropTypes.func.isRequired,
}
