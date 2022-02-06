import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '../../Select';
import Button from '../../Button';
import { deepCopy, isJSONEqual } from '../../../utilities/utilities';

const RelationContainer = styled.div`
    min-height: 3em;
    margin-bottom: 0.5em;
    border: 2px solid #d9d9d9;
    border-radius: 0.15em;
    .input-field {
        padding: 0 3em;
    }

    svg {
        margin: 0;
    }
`;

const Relation = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0.25em 0 0.25em 0.25em;

    .reference-element {
        display: flex;
        flex: 5;
        margin-right: 0.5em;
    }

    .button-group {
        display: flex;
        flex: 2;
        justify-content: right;

        button {
            display: flex;
            justify-content: space-between;
            flex: 1;
            margin: auto 0.25em;
        }
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
            <div>
                <Select
                    options={remainingOptions.map(x => { return { label: x[labelTerm] }; })}
                    selectedIndex={pendingSelection}
                    // searchable={true}
                    // icon={'search'}
                    onSelect={(value) => setPendingSelection(value)}
                />
                <Button disabled={!pendingSelection} icon="plus" type="secondary" label='' onClick={() => handleAddPendingRelation()} />
            </div>
            <>
                {pendingChanges.map((pendingChange, index) => {
                    return (
                        <Relation key={index}>
                            <span className="pendingRelation">{`${pendingChange[labelTerm]} (${pendingChange.id})`}</span>
                            <Button icon="minus" type="secondary" label='' onClick={() => handleRemovePendingRelation(index)} />
                        </Relation>
                    );
                })}
                <ConfirmCancelButtonGroup>
                    <Button type="secondary" label='Cancel' onClick={() => handleCancel()} />
                    <Button type="primary" label='Confirm' disabled={isJSONEqual(pendingChanges, defaultChanges)} onClick={() => handleConfirm()} />
                </ConfirmCancelButtonGroup>
            </>
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
