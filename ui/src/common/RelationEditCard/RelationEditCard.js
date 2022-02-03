import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '../Select';
import Button from '../Button';
import { isJSONEqual } from '../../utilities/utilities';

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

export default function RelationEditCard (props) {
    const {
        relationList,
        getRelationList,
        postRelation,
        putRelation,
        deleteRelation,
        parentType,
        parentId,
        relationType,
        relatedEntityList,
        onChange
    } = props;

    const labelTerm = relationType === 'contact' ? 'firstName' : 'title';

    const [defaultChanges, setDefaultChages] = useState([]);
    const [remainingOptions, setRemainingOptions] = useState([]);
    const [pendingChanges, setPendingChanges] = useState([]);
    const [pendingSelection, setPendingSelection] = useState(0);

    useEffect(() => {
        getRelationList(`${parentType}Id`, parentId);
    }, []);

    useEffect(() => {
        if (relationList.length) {
            // return relations where id of relationType is not null
            const filteredExistingRelations = relationList.filter(relation => relation[`${relationType}Id`]);
            const filteredExistingRelationIds = filteredExistingRelations.map(rel => rel[`${relationType}Id`]);

            const existingRelationValues = [];
            const remainingRelationValues = [];

            relatedEntityList.forEach(entity => {
                if (filteredExistingRelationIds.indexOf(entity.id)) {
                    existingRelationValues.push(entity);
                } else {
                    remainingRelationValues.push(entity);
                }
            });

            setPendingChanges(existingRelationValues);
            setDefaultChages(existingRelationValues);
            setRemainingOptions(remainingRelationValues);
        }
    }, [relationList]);

    useEffect(() => {
        onChange(isJSONEqual(pendingChanges, defaultChanges)); // update parent state whenever pendingChanges is updated
    }, [pendingChanges]);

    function handleRemovePendingRelation (index) {
        setRemainingOptions([...remainingOptions, pendingChanges[index]]);
        setPendingChanges(pendingChanges.splice(index, 1));
    }

    function handleAddPendingRelation () {
        setPendingChanges([...pendingChanges, remainingOptions[pendingSelection]]);
        setRemainingOptions(remainingOptions.splice(pendingSelection, 1));
        setPendingSelection(0);
    }

    function handleCancel () {
        setPendingChanges(defaultChanges);
    }

    function handleConfirm () {
        console.log(pendingChanges);
        if (relationType === 'jack') {
            putRelation(1, {});
            deleteRelation(1);
            postRelation(1);
        }
    }

    return (
        <div className="relationsList">
            <div>
                {`${relationType.toUpperCase()}S`}
            </div>
            <RelationContainer>
                <div>
                    <Select
                        options={remainingOptions.map(x => { return { label: x[labelTerm] }; })}
                        selectedIndex={pendingSelection}
                        // searchable={true}
                        // icon={'search'}
                        onSelect={(e) => setPendingSelection(e.target.index)}
                    />
                    <Button disabled={!pendingSelection} icon="plus" type="secondary" label='' onClick={() => handleAddPendingRelation} />
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
                    <Button icon="minus" type="secondary" label='Cancel' disabled={isJSONEqual(pendingChanges, defaultChanges)} onClick={() => handleCancel()} />
                    <Button icon="plus" type="primary" label='Confirm' disabled={isJSONEqual(pendingChanges, defaultChanges)} onClick={() => handleConfirm()} />
                </>
            </RelationContainer>
        </div>
    );
}

RelationEditCard.propTypes = {
    relationList: PropTypes.array.isRequired,
    getRelationList: PropTypes.func.isRequired,
    postRelation: PropTypes.func.isRequired,
    putRelation: PropTypes.func.isRequired,
    deleteRelation: PropTypes.func.isRequired,
    parentType: PropTypes.string.isRequired,
    parentId: PropTypes.number.isRequired,
    relationType: PropTypes.string.isRequired,
    relatedEntityList: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
};
