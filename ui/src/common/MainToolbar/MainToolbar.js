import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Input from '../../common/Input/Input';
import Button from '../../common/Button';
import Tooltip from '../Tooltip/Tooltip';
import SortOrderControls from './SortOrderControls';
import { exportDataList } from '../../common/Utilities/utilities';
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

export default function MainToolbar (props) {
    const {
        updateActiveFilters,
        searchTerm,
        searchFields,
        sortOptions,
        updateSearchTerm,
        handleDirectionUpdate,
        handleOrderUpdate,
        type,
        currentDirection,
        currentOrder,
        contactList,
        noteList
    } = props;
    const history = useHistory();
    const [selectedSearchFields, setSelectedSearchFields] = useState(searchFields);
    const [filtersApplied, setFiltersApplied] = useState(false);

    function exportList () {
        let list, name;
        if (type === 'Contact') {
            list = contactList.results;
            name = 'contactList';
        } else if (type === 'Note') {
            list = noteList.results;
            name = 'noteList';
        }
        exportDataList([type.toLowerCase()], [list], name);
    }

    function handleSelectionChange (index) {
        const newSelections = selectedSearchFields;
        newSelections[index].selected = !newSelections[index].selected;
        setSelectedSearchFields(newSelections);

        setFiltersApplied(newSelections.filter(f => f.selected).length);

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
                    onClick={() => history.push(`/${type.toLowerCase()}s/new`)}
                />
                <Button
                    icon="download"
                    label={'Export Page Results'}
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
                        margin: 'auto 0'
                    }}
                >
                    <Button
                        icon={filtersApplied ? 'filterCircleFill' : 'filterCircle'}
                        label="Filters"
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
                            sortOptions={sortOptions}
                        />
                    }
                    style={{
                        margin: 'auto 0'
                    }}
                >
                    <Button
                        label={'Sort'}
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
    searchFields: PropTypes.array.isRequired,
    sortOptions: PropTypes.array.isRequired,
    updateSearchTerm: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    currentOrder: PropTypes.string.isRequired,
    handleOrderUpdate: PropTypes.func.isRequired,
    currentDirection: PropTypes.string.isRequired,
    handleDirectionUpdate: PropTypes.func.isRequired,
    contactList: PropTypes.object.isRequired,
    noteList: PropTypes.object.isRequired
};
