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

overflow-y: auto;
overflow-x: hidden;

#popover-header {
    border-bottom: solid black 1px;
    height: 1.25em;
    font-size: 1.25em;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin: 0 2.5%;
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


const RadioList = styled.div`
    .section-header {
        font-size: 14px;
    }
    
    .highlight {
        background: #4D98EF;
        border-radius: 50%;
        height: 12px;
        left: 14px;
        pointer-events: none;
        position: absolute;
        top: 14px;
        transition: transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.2);
        width: 12px;
    }
`;

const RadioEntry = styled.div`
    display: block;
    width: 100%;
    height: 1em;
    line-height: 1em;
    margin: 0.25em 0 0.75em 1em;
    position: relative;
    
    .entry {
        height: 2em;
        position: absolute;
        width: 100%;
    }
    .entry-label {
        cursor: pointer;
        padding-left: 0.5em;
        user-select: none;
        -moz-user-select: none;
    }
    input:checked {
        border-color: #4D98EF;
    }
    input:hover {
        cursor: pointer;
    }
`;

export default function SortOrderControls(props) {
    const { currentDirection, currentOrder, handleOrderUpdate, handleDirectionUpdate } = props;

    const contactSortOptions = [
        {
            label: 'First Name',
            value: 'firstName'
        },
        {
            label: 'Last Name',
            value: 'lastName'
        },
        {
            label: 'Date Of Birth',
            value: 'dateOfBirth'
        },
        {
            label: 'Date Created',
            value: 'createdOn'
        },
        {
            label: 'Date of Last Change',
            value: 'lastModifiedOn'
        },
        // {
        //     label: 'Recently Interacted',
        //     value: 'lastInteractedOn'
        // },
    ]



    function handleDirectionClick(event) {
        if (event.target.attributes.value &&
            event.target.attributes.value.value !== currentDirection) {
            //validate that the click is not on the edge (css might make some area clickable that doesn't have value)
            //and validate something is actually changing
            handleDirectionUpdate(event.target.attributes.value.value);
        }
    }

    return (
        <PopoverContainer>
            <div id="popover-header" label="Select Sort Field & Direction">
                Sort Field & Direction
                            </div>
            <div id="order-direction" onClick={event => handleDirectionClick(event)}>
                <span value="ASC" title="Ascending" className={currentDirection === 'ASC' ? 'activeDirection' : 'inactiveDirection'}>
                    Ascending
                                </span>
                <span value="DESC" title="Descending" className={currentDirection === 'DESC' ? 'activeDirection' : 'inactiveDirection'}>
                    Descending
                                </span>
            </div>
            <RadioList>
                {contactSortOptions.map((option, index) => {
                    return (
                        <RadioEntry key={index}>
                            <input readonly checked={option.value === currentOrder} type="radio" id={index} name="inputs" onClick={event => handleOrderUpdate(contactSortOptions[event.target.id].value)} />
                            <label className="entry" for={index}>
                                <div className="entry-label">{option.label}</div>
                            </label>
                        </RadioEntry>
                    )
                })}
            </RadioList>
        </PopoverContainer>
    )
}


SortOrderControls.propTypes = {
    currentOrder: PropTypes.string.isRequired,
    handleOrderUpdate: PropTypes.func.isRequired,
    currentDirection: PropTypes.string.isRequired,
    handleDirectionUpdate: PropTypes.func.isRequired,
    //interactionList: PropTypes.object.isRequired,
}
