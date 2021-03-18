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
    const { currentSelections, updateSelections } = props;

    function handleSelectionChange(index) {
        const newSelections = currentSelections;
        newSelections[index].selected = !newSelections[index].selected;
        updateSelections(newSelections);
    }

    return (
        <PopoverContainer>
            <div id="popover-header" label="Filters">
                Filters
            </div>
            <div id="search-filters">
                <strong>Search on fields:</strong>
                <div>
                    {currentSelections.forEach((field, index) => {
                        return (
                            <div key={index} class="form-check">
                                <input class="form-check-input" type="checkbox" checked={field.checked} value={field.value} onClick={() => handleSelectionChange(index)} />
                                <label class="form-check-label">
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
    currentSelections: PropTypes.array.isRequired,
    updateSelections: PropTypes.func.isRequired,
}
