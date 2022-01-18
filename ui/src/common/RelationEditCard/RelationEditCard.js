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
`;

const Relation = styled.div`
    display: flex;
    justify-content: space-between;

    Select {
        flex: 3;
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
                        <Relation key={index}>
                            <Select options={filteredRelations} selectedIndex={filteredRelations.indexOf(relation)} onChange={(e) => console.log(e)} />
                            <Button icon="trashCan" type="secondary" onClick={() => deleteRelation(relation.id)}/>
                            <Button icon="saveIcon" type="secondary" onClick={() => handleUpdateRelation(relation.id)}/> {/* disabled unless pending changes to this relation. On save of entity, error if unsaved changes, prompt user to 'confirm pending changes to relations */}
                        </Relation>
                    );
                })}
                <Relation key={filteredRelations.length}>
                    <Select options={filteredRelations} selectedIndex={-1} onChange={(val) => setPendingRelation(val)} />
                    <Button icon="trashCan" type="secondary" onClick={() => setPendingRelation(-1)}/>
                    <Button disabled={pendingRelation < 0} type="secondary" icon="saveIcon" onClick={() => handleCreateRelation()}/>
                </Relation>
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
