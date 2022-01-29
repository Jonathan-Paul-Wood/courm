import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '../Select';
import Button from '../Button';
import { deepCopy, isJSONEqual } from '../../utilities/utilities';

const RelationContainer = styled.div`
    min-height: 3em;
    margin-bottom: 0.5em;
    border: 2px solid #d9d9d9;
    border-radius: 0.15em;
    .input-field {
        padding: 0 3em;
    }

    #relationListError {
        font-size: 0.75em;
        font-style: italic;
        padding-left: 1em;
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
    const { relationList, relationType, parentType, parentId, options, postRelation, deleteRelation, putRelation } = props;

    const blankRelation = { firstName: '', title: '', label: '', id: null };
    const [pendingNewRelation, setPendingNewRelation] = useState(blankRelation);
    const filteredRelations = relationList.filter(r => r[relationType + 'Id'] !== 'null');
    const [pendingChanges, setPendingChanges] = useState(filteredRelations);
    console.log('RELATION TYPE: ', relationType);
    console.log('relationList: ', relationList);

    const labelTerm = relationType === 'contact' ? 'firstName' : 'title';
    // get relations of this component's type
    const relationsWithPending = [pendingNewRelation, ...pendingChanges];
    console.log('filtered relations with pending: ', relationsWithPending);
    // get entities that do not have relations
    const filteredOptions = [];
    const formattedSelections = [];
    options.forEach(option => {
        console.log('option: ', option);
        if (!relationsWithPending.find(fRel => parseInt(fRel[relationType + 'Id']) === parseInt(option.id))) {
            console.log('option added');
            filteredOptions.push({ label: option[labelTerm], id: option.id });
        } else if (option.id !== pendingNewRelation[relationType + 'Id']) {
            formattedSelections.push({ label: option[labelTerm], id: option.id });
        }
    });
    console.log('filtered options: ', filteredOptions);

    function handleCreateRelation (id) {
        const newRelation = {
            contactId: '',
            noteId: '',
            eventId: ''
        };
        newRelation[relationType + 'Id'] = id;
        newRelation[parentType + 'Id'] = parentId;
        console.log('newRelation: ', newRelation);
        postRelation(newRelation);
    };

    function handleUpdateRelation (id) {
        const modifiedRelation = {
            contactId: '',
            noteId: '',
            eventId: ''
        };
        modifiedRelation[relationType + 'Id'] = id;
        modifiedRelation[parentType + 'Id'] = parentId;
        putRelation(id, modifiedRelation);
    };

    function updatePendingNewRelation (index) {
        console.log(index);
        if (index > -1) {
            setPendingNewRelation(filteredOptions[index]);
        } else {
            setPendingNewRelation(blankRelation);
        }
    }

    function updatePendingChanges (changedIndex, selectedIndex) {
        const newPending = deepCopy(pendingChanges);
        newPending[changedIndex] = filteredOptions[selectedIndex];
        setPendingChanges(newPending);
    }

    console.log('formattedSelections: ', formattedSelections);
    return (
        <div className="relationsList">
            <div>
                {`${relationType.toUpperCase()}S`}
            </div>
            <RelationContainer>
                {formattedSelections.map((relation, index) => {
                    console.log('relation: ', relation);
                    return (
                        <Relation key={index}>
                            <Select options={[relation, ...filteredOptions]} selectedIndex={pendingChanges.indexOf(relation)} onSelect={(val) => updatePendingChanges(index, val)} />
                            <span className="button-group">
                                <Button icon="trashCan" type="secondary" label='' onClick={() => deleteRelation(relation.id)}/>
                                <Button icon="saveIcon" type="secondary" label='' onClick={() => handleUpdateRelation(relation.id)}/> {/* disabled unless pending changes to this relation. On save of entity, error if unsaved changes, prompt user to 'confirm pending changes to relations */}
                            </span>
                        </Relation>
                    );
                })}
                <Relation key={pendingChanges.length}>
                    <Select options={[pendingNewRelation, ...filteredOptions]} selectedIndex={-1} onSelect={(val) => updatePendingNewRelation(val - 1)} />
                    <span className="button-group">
                        <Button disabled={isJSONEqual(pendingNewRelation, blankRelation)} icon="trashCan" type="secondary" label='' onClick={() => updatePendingNewRelation(-1)}/>
                        <Button disabled={isJSONEqual(pendingNewRelation, blankRelation)} icon="saveIcon" type="secondary" label='' onClick={() => handleCreateRelation(pendingNewRelation.id)}/>
                    </span>
                </Relation>
            </RelationContainer>
        </div>
    );
}

RelationEditCard.propTypes = {
    relationList: PropTypes.array.isRequired,
    relationType: PropTypes.string.isRequired,
    parentType: PropTypes.string.isRequired,
    parentId: PropTypes.number.isRequired,
    options: PropTypes.array.isRequired,
    postRelation: PropTypes.func.isRequired,
    putRelation: PropTypes.func.isRequired,
    deleteRelation: PropTypes.func.isRequired
};
