import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import RelationViewCard from './RelationViewCard';
import RelationEditCard from './RelationEditCard';

const RelationsContainer = styled.div`
    display: flex;
    justify-content: space-between;

    .relationsList {
        min-width: 50%;
        margin: 1em;
    }
`;

export default function RelationCardManager (props) {
    const {
        getRelationList,
        isRelationListPending,
        parentType,
        parentId,
        relationType,
        editMode,
        disableEdit,
        onChange,
        contactList,
        getContactList,
        isContactListPending,
        eventList,
        getEventList,
        isEventListPending,
        noteList,
        getNoteList,
        isNoteListPending
    } = props;

    useEffect(() => {
        getRelationList(`${parentType}Id`, `${parentId}`);
        getContactList(100000);
        getEventList(100000);
        getNoteList(100000);
    }, []);

    let relatedEntityList = [];
    switch (relationType) {
    case 'contact':
        relatedEntityList = contactList.results ?? [];
        break;
    case 'event':
        relatedEntityList = eventList.results ?? [];
        break;
    case 'note':
        relatedEntityList = noteList.results ?? [];
        break;
    }

    return (
        <RelationsContainer>
            <div>
                {`${relationType.toUpperCase()}S`}
            </div>
            {(isRelationListPending || isContactListPending || isEventListPending || isNoteListPending)
                ? <LoadingSpinner />
                : (editMode
                    ? <RelationViewCard relationType={relationType} />
                    : <RelationEditCard
                        parentType={parentType}
                        parentId={parentId}
                        relationType={relationType}
                        relatedEntityList={relatedEntityList}
                        editMode={editMode}
                        disableEdit={disableEdit}
                        onChange={onChange}
                    />
                )
            }
        </RelationsContainer>
    );
}

RelationCardManager.propTypes = {
    parentType: PropTypes.string.isRequired,
    parentId: PropTypes.number.isRequired,
    relationType: PropTypes.string.isRequired,
    editMode: PropTypes.bool.isRequired,
    disableEdit: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    contactList: PropTypes.object.isRequired,
    getContactList: PropTypes.func.isRequired,
    isContactListPending: PropTypes.bool.isRequired,
    eventList: PropTypes.object.isRequired,
    getEventList: PropTypes.func.isRequired,
    isEventListPending: PropTypes.bool.isRequired,
    noteList: PropTypes.object.isRequired,
    getNoteList: PropTypes.func.isRequired,
    isNoteListPending: PropTypes.bool.isRequired,
    getRelationList: PropTypes.func.isRequired,
    isRelationListPending: PropTypes.bool.isRequired
};
