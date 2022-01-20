import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Select from '../Select';
import Button from '../Button';

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

    Select {
        flex: 3;
    }
`;

export default function RelationEditCard (props) {
    const { relationList, relationType, options, postRelation, deleteRelation, putRelation } = props;

    const blankRelation = { firstName: '', title: '', label: '', id: null };
    const [pendingNewRelation, setPendingNewRelation] = useState(blankRelation);
    console.log('relationList: ', JSON.stringify(relationList));

    const labelTerm = relationType === 'contact' ? 'firstName' : 'title';
    const filteredRelations = relationList.filter(r => r[relationType + 'Id'] !== 'null');
    const relationsWithPending = [...filteredRelations, pendingNewRelation];
    console.log('relationsWithPending: ', relationsWithPending);
    // get entities that do not have relations
    const filteredOptions = [];
    options.forEach(option => {
        console.log('option: ', option);
        if (!relationsWithPending.find(fRel => fRel.id === option.id)) {
            filteredOptions.push({ label: option[labelTerm], id: option.id });
        }
    });
    console.log('filteredOptions: ', filteredOptions);

    function handleCreateRelation () {
        const newRelation = {
            contactId: '',
            noteId: '',
            eventId: ''
        };
        postRelation(newRelation);
    };

    function handleUpdateRelation (id) {
        const modifiedRelation = {
            contactId: '',
            noteId: '',
            eventId: ''
        };
        putRelation(id, modifiedRelation);
    };

    function updatePendingRelation (index) {
        console.log(index);
        if (index > -1) {
            setPendingNewRelation(filteredOptions[index]);
        } else {
            setPendingNewRelation(blankRelation);
        }
    }

    return (
        <div className="relationsList">
            <div>
                {`${relationType.toUpperCase()}S`}
            </div>
            <RelationContainer>
                {filteredRelations.map((relation, index) => {
                    return (
                        <Relation key={index}>
                            <Select options={[relation, ...filteredOptions]} selectedIndex={filteredRelations.indexOf(relation)} onSelect={(e) => console.log(e)} />
                            <Button icon="trashCan" type="secondary" label='' onClick={() => deleteRelation(relation.id)}/>
                            <Button icon="saveIcon" type="secondary" label='' onClick={() => handleUpdateRelation(relation.id)}/> {/* disabled unless pending changes to this relation. On save of entity, error if unsaved changes, prompt user to 'confirm pending changes to relations */}
                        </Relation>
                    );
                })}
                <Relation key={filteredRelations.length}>
                    <Select options={[pendingNewRelation, ...filteredOptions]} selectedIndex={-1} onSelect={(val) => updatePendingRelation(val - 1)} />
                    <Button icon="trashCan" type="secondary" label='' onClick={() => updatePendingRelation(-1)}/>
                    <Button disabled={!pendingNewRelation} icon="saveIcon" type="secondary" label='' onClick={() => handleCreateRelation()}/>
                </Relation>
            </RelationContainer>
        </div>
    );
}

RelationEditCard.propTypes = {
    relationList: PropTypes.array.isRequired,
    relationType: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    postRelation: PropTypes.func.isRequired,
    putRelation: PropTypes.func.isRequired,
    deleteRelation: PropTypes.func.isRequired
};
