import React from 'react';
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
`;

export default function FilterControls (props) {
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
                                <label className="form-check-label" htmlFor={`checkbox-filter-${field.value}`}>
                                    {field.label}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PopoverContainer>
    );
}

FilterControls.propTypes = {
    activeFilters: PropTypes.array.isRequired,
    updateActiveFilters: PropTypes.func.isRequired
};
