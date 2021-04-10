import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Input from '../../common/Input/Input';
import Button from '../../common/Button';
import Tooltip from '../Tooltip/Tooltip';
import SortOrderControls from './SortOrderControls';
import { exportContactList } from '../../common/Utilities/utilities';
import FilterControls from './FilterControls';

const ContentWrapper = styled.div`

`;

const ControlContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin-bottom: 0.5em;
    .input-field {
        padding: 0 3em;
    }
`;

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


export default function MainToolbar(props) {
    const history = useHistory();
    const [selectedSearchFields, setSelectedSearchFields] = useState([
        {
            label: 'First Name',
            value: 'firstName',
            selected: false
        },
        {
            label: 'Last Name',
            value: 'lastName',
            selected: false
        },
        {
            label: 'Email',
            value: 'email',
            selected: false
        },
        {
            label: 'Phone Number',
            value: 'phoneNumber',
            selected: false
        },
        {
            label: 'Address',
            value: 'address',
            selected: false
        },
        {
            label: 'Firm',
            value: 'firm',
            selected: false
        },
        {
            label: 'Industry',
            value: 'industry',
            selected: false
        },
    ]);

    const {
        updateActiveFilters,
        searchTerm,
        updateSearchTerm,
        handleDirectionUpdate,
        handleOrderUpdate,
        type,
        currentDirection,
        currentOrder,
        contactList
    } = props;

    function exportList() {
        const list = type === 'Contact' ? contactList : 'interactionList';
        exportContactList(list, `contactList`);
    }

    
    function handleSelectionChange(index) {
        const newSelections = selectedSearchFields;
        newSelections[index].selected = !newSelections[index].selected;
        setSelectedSearchFields(newSelections);
        
        const selectedFields = [];
        newSelections.forEach(filter => {
            if (filter.selected) {
                selectedFields.push(filter.value);
            }
        });
        updateActiveFilters(selectedFields);
    }

    return (
        <ContentWrapper>
            <ControlContainer>
                <Button
                    icon="plusCircle"
                    label={`Add ${type}`}
                    onClick={() => history.push('/contacts/new')}
                />
                <Button
                    icon="download"
                    label={`Export Page Results`}
                    onClick={exportList}
                />
            </ControlContainer>
            <ControlContainer>
                <Tooltip
                    content={
                        <FilterControls
                            updateActiveFilters={handleSelectionChange}
                            activeFilters={selectedSearchFields}
                        />
                    }
                    style={{
                        'margin': 'auto 0',
                    }}
                >
                    <Button
                        label="Filter"
                        type="secondary"
                        onClick={() => { }}
                    />
                </Tooltip>
                <Input
                    placeholder="Search (3 character minimum)"
                    label="Search"
                    value={searchTerm}
                    onChange={event => updateSearchTerm(event.target.value)}
                />
                <Tooltip
                    content={
                        <SortOrderControls
                            currentOrder={currentOrder}
                            handleOrderUpdate={handleOrderUpdate}
                            currentDirection={currentDirection}
                            handleDirectionUpdate={handleDirectionUpdate}
                        />
                    }
                    style={{
                        'margin': 'auto 0',
                    }}
                >
                    <Button
                        label={`Sort`}
                        type="secondary"
                        onClick={() => { }}
                    />
                </Tooltip>
            </ControlContainer>
        </ContentWrapper>
    );
}

MainToolbar.propTypes = {
    updateActiveFilters: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
    updateSearchTerm: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    currentOrder: PropTypes.string.isRequired,
    handleOrderUpdate: PropTypes.func.isRequired,
    currentDirection: PropTypes.string.isRequired,
    handleDirectionUpdate: PropTypes.func.isRequired,
    contactList: PropTypes.array.isRequired,
    //interactionList: PropTypes.object.isRequired,
}