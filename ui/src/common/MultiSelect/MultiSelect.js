import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '../../common/Select';
import Button from '../../common/Button';
import { GREY, WHITE, SECONDARY } from '../../assets/colorsConstants';
import ScrollContainer from '../ScrollContainer';

const RelationContainer = styled.div`
    width: calc(50% - 1em);

    @media (max-width: 960px) {
        width: 100%;
    }

    .relationSelectRow {
        display: flex;
        justify-content: space-between;
        
        Select {
            display: flex;
            flex: 3;
            height: 2em;

            .input-field {
                width: 100%;
                height: 2em;
            }
        }
        Button {
            display: flex;
            flex: 1;
            margin-left: 2em;
        }
    }

    .selectedRelationsBox {
        padding: 0.25em;
        margin: 0.5em 0;
        border-radius: 0.25em;
    }

    svg {
        margin: 0;
    }
`;

const Relation = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0.25em 1em;

    padding: 0.25em;
    background-color: ${WHITE};
    border-radius: 0.25em;

    .pendingRelationText {
        width: calc(100% - 5em);
        white-space: nowrap;
        display: flex;
        cursor: default;

        .pendingRelationLabel {
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 2em;
            height: 2em;
        }
        .pendingRelationId {
            line-height: 2em;
            height: 2em;
            display: flex;
            flex: 1;
        }
    }

    Button {
        margin-left: 1em;
    }
`;

export default function MultiSelect (props) {
    const { options, onChange, title } = props;
    const [remainingOptions, setRemainingOptions] = useState(options);
    const [pendingChanges, setPendingChanges] = useState([]);
    const [pendingSelection, setPendingSelection] = useState(0);

    useEffect(() => {
        const selectedIds = new Set(pendingChanges.map(change => change.id));
        const nextRemainingOptions = options.filter(option => !selectedIds.has(option.id));
        setRemainingOptions(nextRemainingOptions);

        if (!nextRemainingOptions.length || pendingSelection >= nextRemainingOptions.length) {
            setPendingSelection(0);
        }
    }, [options, pendingChanges, pendingSelection]);

    function handleRemovePendingRelation (index) {
        const newPending = pendingChanges.filter((_, i) => i !== index);
        setPendingChanges(newPending);
        onChange(newPending);
    }

    function handleAddPendingRelation () {
        if (!remainingOptions.length) {
            return;
        }

        const newPending = [...pendingChanges, remainingOptions[pendingSelection]];
        setPendingChanges(newPending);
        onChange(newPending);
        setPendingSelection(0);
    }

    return (
        <RelationContainer>
            <div style={{
                width: '100%',
                color: `${SECONDARY}`,
                fontWeight: '600'
            }}>
                {title}
            </div>
            <div className="relationSelectRow">
                <Select
                    options={remainingOptions.map(x => { return { label: x.title }; })}
                    selectedIndex={pendingSelection}
                    // searchable={true}
                    // icon={'search'}
                    onSelect={(selectedIndex) => setPendingSelection(selectedIndex)}
                />
                <Button disabled={remainingOptions.length === 0} icon="plus" type="secondary" label='' onClick={() => handleAddPendingRelation()} />
            </div>
            <ScrollContainer
                style={{
                    height: '8em',
                    width: '100%',
                    backgroundColor: `${GREY}`,
                    margin: '0.25em 0',
                    borderRadius: '0.25em'
                }}
                className="selectedRelationsBox"
            >
                {pendingChanges.map((pendingChange, index) => {
                    return (
                        <Relation key={index}>
                            <div className="pendingRelationText">
                                <span className="pendingRelationLabel" title={pendingChange.title}>{pendingChange.title}</span>
                                <span className="pendingRelationId">{` (Id: ${pendingChange.id})`}</span>
                            </div>
                            <Button icon="minus" type="secondary" label='' onClick={() => handleRemovePendingRelation(index)} />
                        </Relation>
                    );
                })}
            </ScrollContainer>
        </RelationContainer>
    );
}

MultiSelect.defaultProps = {
    title: ''
};

MultiSelect.propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    title: PropTypes.string
};
