import AppConfigure from './AppConfigure';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContactList } from '../../store/ContactList/actions';
import { postContact, deleteContact } from '../../store/Contact/actions';
import { getEventList } from '../../store/EventList/actions';
import { postEvent, deleteEvent } from '../../store/Event/actions';
import { getNoteList } from '../../store/NoteList/actions';
import { postNote, deleteNote } from '../../store/Note/actions';
import { getAllRelations } from '../../store/RelationList/actions';
import { postRelation, deleteRelation } from '../../store/Relation/actions';

function mapStateToProps (state) {
    return {
        contacts: state.contactList.contacts,
        isContactListPending: state.contactList.isContactListPending,
        contactListError: state.contactList.contactListError,
        isContactPostPending: state.contact.isContactPostPending,
        contactPostError: state.contact.contactPostError,
        isContactDeletePending: state.contact.isContactDeletePending,
        events: state.eventList.events,
        isEventListPending: state.eventList.isEventListPending,
        eventListError: state.eventList.eventListError,
        isEventPostPending: state.event.isEventPostPending,
        eventPostError: state.event.eventPostError,
        isEventDeletePending: state.event.isEventDeletePending,
        notes: state.noteList.notes,
        isNoteListPending: state.noteList.isNoteListPending,
        noteListError: state.noteList.noteListError,
        isNotePostPending: state.note.isNotePostPending,
        notePostError: state.note.notePostError,
        isNoteDeletePending: state.note.isNoteDeletePending,
        relations: state.relationList.relations,
        isRelationListPending: state.relationList.isRelationListPending,
        relationListError: state.relationList.relationListError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContactList,
            postContact,
            deleteContact,
            getEventList,
            postEvent,
            deleteEvent,
            getNoteList,
            postNote,
            deleteNote,
            getAllRelations,
            postRelation,
            deleteRelation
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigure);
