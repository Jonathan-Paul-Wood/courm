import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import RelationViewCard from './RelationViewCard';
import RelationEditCard from './RelationEditCard';
import { PURPLE } from '../../assets/colorsConstants';

const RelationsContainer = styled.div`
    width: 50%;
    margin: 1em;

    .relationTypeTitle {
        width: 100%;
        color: ${PURPLE};
        font-weight: 600;
    }

    .relationList {
        min-height: 3em;
        margin-bottom: 0.5em;
        border: 2px solid #d9d9d9;
        border-radius: 0.15em;
        display: flex;
        width: 100%;
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

    const labelTerm = relationType === 'contact' ? 'firstName' : 'title'; // CONSTANTS

    function handleRelationListUpdate (value) {
        getRelationList(`${parentType}Id`, `${parentId}`);
        onChange(value);
    }

    return (
        <RelationsContainer>
            <div className="relationTypeTitle">
                {`${relationType.toUpperCase()}S`}
            </div>
            <div className="relationList">
                {(isRelationListPending || isContactListPending || isEventListPending || isNoteListPending)
                    ? <LoadingSpinner />
                    : (editMode
                        ? <RelationEditCard
                            parentType={parentType}
                            parentId={parentId}
                            relationType={relationType}
                            relatedEntityList={relatedEntityList}
                            onChange={handleRelationListUpdate}
                            labelTerm={labelTerm}
                        />
                        : <RelationViewCard
                            relationType={relationType}
                            relatedEntityList={relatedEntityList}
                            enableEdit={handleRelationListUpdate}
                            disableEdit={disableEdit}
                            labelTerm={labelTerm}
                        />
                    )
                }
            </div>
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
