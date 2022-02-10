import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '../../Select';
import Button from '../../Button';
import { deepCopy, isJSONEqual } from '../../../utilities/utilities';
import { GREY, WHITE } from '../../../assets/colorsConstants';

const RelationContainer = styled.div`
    margin: 0.25em;
    width: calc(100% - 0.5em);

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
        background-color: ${GREY};
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
    margin: 0.25em 0;

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

const ConfirmCancelButtonGroup = styled.div`
    display: flex;
    justify-content: right;
`;

export default function RelationEditCard (props) {
    const {
        relatedEntityList,
        relationList,
        postRelation,
        putRelation,
        deleteRelation,
        parentType,
        parentId,
        relationType,
        onChange,
        labelTerm
    } = props;

    const [relationsOfCurrentType, setRelationsOfCurrentType] = useState([]);
    const [defaultChanges, setDefaultChages] = useState([]);
    const [defaultOptions, setDefaultOptions] = useState([]);
    const [remainingOptions, setRemainingOptions] = useState([{ label: 'Select Option' }]);
    const [pendingChanges, setPendingChanges] = useState([]);
    const [pendingSelection, setPendingSelection] = useState(0);

    useEffect(() => {
        // return relations where id of relationType is not null
        const filteredExistingRelations = relationList.filter(relation => relation[`${relationType}Id`]);
        setRelationsOfCurrentType(filteredExistingRelations);
        const filteredExistingRelationIds = filteredExistingRelations.map(rel => rel[`${relationType}Id`]);
        console.log('filteredExistingRelationIds: ', filteredExistingRelationIds);
        const existingRelationValues = [];
        const remainingRelationValues = [{ firstName: 'Select Option', title: 'Select Option' }]; // CONSTANTS

        relatedEntityList.forEach(entity => {
            console.log('entity: ', entity);
            if (filteredExistingRelationIds.indexOf(entity.id) >= 0) {
                existingRelationValues.push(entity);
            } else {
                remainingRelationValues.push(entity);
            }
        });

        setPendingChanges(existingRelationValues);
        setDefaultChages(existingRelationValues);
        setRemainingOptions(remainingRelationValues);
        setDefaultOptions(remainingRelationValues);
    }, []);

    function handleRemovePendingRelation (index) {
        setRemainingOptions([...remainingOptions, pendingChanges[index]]);
        const newPending = pendingChanges.filter((_, i) => i !== index);
        setPendingChanges(newPending);
    }

    function handleAddPendingRelation () {
        setPendingChanges([...pendingChanges, remainingOptions[pendingSelection]]);
        const newRemainingOptions = remainingOptions.filter((_, i) => i !== pendingSelection);
        setRemainingOptions(newRemainingOptions);
        setPendingSelection(0);
    }

    function handleCancel () {
        setPendingChanges(defaultChanges);
        setRemainingOptions(defaultOptions);
        onChange(false);
    }

    function handleConfirm () {
        const existingDatabaseRelations = deepCopy(relationsOfCurrentType);
        pendingChanges.forEach(change => {
            if (existingDatabaseRelations.find((relation, i) => {
                if (relation[`${relationType}Id`] === change.id) {
                    existingDatabaseRelations.splice(i, 1);
                    return true;
                }
                return false;
            })) {
                const newBody = {};
                newBody[`${parentType}Id`] = parentId;
                newBody[`${relationType}Id`] = change.id;
                console.log('put new body: ', newBody);
                putRelation(change.id, newBody);
            } else {
                const newBody = {
                    contactId: null,
                    eventId: null,
                    noteId: null
                };
                newBody[`${parentType}Id`] = parentId;
                newBody[`${relationType}Id`] = change.id;
                console.log('post new body: ', newBody);
                postRelation(newBody);
            }
        });
        // existingDatabaseRelations that did not have corresponding pendingChanges have been removed
        console.log('delete these: ', existingDatabaseRelations);
        existingDatabaseRelations.forEach(relation => {
            deleteRelation(relation.id);
        });

        onChange(false);
    }

    return (
        <RelationContainer>
            <div className="relationSelectRow">
                <Select
                    options={remainingOptions.map(x => { return { label: x[labelTerm] }; })}
                    selectedIndex={pendingSelection}
                    // searchable={true}
                    // icon={'search'}
                    onSelect={(value) => setPendingSelection(value)}
                />
                <Button disabled={!pendingSelection} icon="plus" type="secondary" label='' onClick={() => handleAddPendingRelation()} />
            </div>
            <div className="selectedRelationsBox">
                {pendingChanges.map((pendingChange, index) => {
                    return (
                        <Relation key={index}>
                            <div className="pendingRelationText">
                                <span className="pendingRelationLabel" title={pendingChange[labelTerm]}>{pendingChange[labelTerm]}</span>
                                <span className="pendingRelationId">{` (Id: ${pendingChange.id})`}</span>
                            </div>
                            <Button icon="minus" type="secondary" label='' onClick={() => handleRemovePendingRelation(index)} />
                        </Relation>
                    );
                })}
            </div>
            <ConfirmCancelButtonGroup>
                <Button type="secondary" label='Cancel' onClick={() => handleCancel()} />
                <Button type="primary" label='Confirm' disabled={isJSONEqual(pendingChanges, defaultChanges)} onClick={() => handleConfirm()} />
            </ConfirmCancelButtonGroup>
        </RelationContainer>
    );
}

RelationEditCard.propTypes = {
    relatedEntityList: PropTypes.array.isRequired,
    relationList: PropTypes.array.isRequired,
    postRelation: PropTypes.func.isRequired,
    putRelation: PropTypes.func.isRequired,
    deleteRelation: PropTypes.func.isRequired,
    parentType: PropTypes.string.isRequired,
    parentId: PropTypes.number.isRequired,
    relationType: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    labelTerm: PropTypes.string.isRequired
};
