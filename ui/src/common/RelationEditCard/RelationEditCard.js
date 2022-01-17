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

    const [pendingRelation, setPendingRelation] = useState('');
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
        const pendingRelation = {
            contactId: '',
            noteId: '',
            eventId: ''
        };
        putRelation(id, pendingRelation);
    };

    function clearPendingRelation () {
        console.log('clear some state');
    }

    return (
        <div className="relationsList">
            <div>
                {`${relationType.toUpperCase()}S`}
            </div>
            <RelationContainer>
                {filteredRelations.map((relation, index) => {
                    return (
                        <span key={index}>
                            <Input label='' value={relation[relationType].value} onChange={(e) => console.log(e)} />
                            <Button icon="trash" onClick={() => deleteRelation(relation.id)}/>
                            <Button icon="save" onClick={() => handleUpdateRelation(relation.id)}/> {/* disabled unless pending changes to this relation. On save of entity, error if unsaved changes, prompt user to 'confirm pending changes to relations */}
                        </span>
                    );
                })}
                <span>
                    <Input placeholder={`${relationType}`} label='' value={pendingRelation} onChange={(val) => setPendingRelation(val)} />
                    <Button icon="trash" onClick={() => clearPendingRelation()}/>
                    <Button icon="save" onClick={() => handleCreateRelation()}/>
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
