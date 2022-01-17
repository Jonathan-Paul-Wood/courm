import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Input from '../Input';
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
`;

export default function RelationEditCard (props) {
    const { relationList, relationType, postRelation, deleteRelation, putRelation } = props;

    const [pendingRelation, setPendingRelation] = useState(-1);
    console.log('relationList: ', JSON.stringify(relationList));
    console.log(relationList);

    const filteredRelations = relationList.filter(r => r[relationType + 'Id'] !== 'null');

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

    return (
        <div className="relationsList">
            <div>
                {`${relationType.toUpperCase()}S`}
            </div>
            <RelationContainer>
                {filteredRelations.map((relation, index) => {
                    return (
                        <span key={index}>
                            <Select options={filteredRelations} selectedIndex={filteredRelations.indexOf(relation)} onChange={(e) => console.log(e)} />
                            <Button icon="trashCan" onClick={() => deleteRelation(relation.id)}/>
                            <Button icon="saveIcon" onClick={() => handleUpdateRelation(relation.id)}/> {/* disabled unless pending changes to this relation. On save of entity, error if unsaved changes, prompt user to 'confirm pending changes to relations */}
                        </span>
                    );
                })}
                <span>
                    <Input placeholder={`${relationType}`} label='' value={pendingRelation} onChange={(val) => setPendingRelation(val)} />
                    <Button icon="trashCan" onClick={() => setPendingRelation(-1)}/>
                    <Button disabled={pendingRelation < 0} icon="saveIcon" onClick={() => handleCreateRelation()}/>
                </span>
            </RelationContainer>
        </div>
    );
}

RelationEditCard.propTypes = {
    relationList: PropTypes.array.isRequired,
    relationType: PropTypes.string.isRequired,
    postRelation: PropTypes.func.isRequired,
    putRelation: PropTypes.func.isRequired,
    deleteRelation: PropTypes.func.isRequired
};
