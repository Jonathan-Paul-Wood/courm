import EditContact from './EditContact';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContact, putContact, postContact, deleteContact } from '../../store/Contact/actions';
import { getNoteList } from '../../store/NoteList/actions';
import { getEventList } from '../../store/EventList/actions';

function mapStateToProps (state) {
    return {
        contact: state.contact.contact,
        isContactPending: state.contact.isContactPending,
        contactError: state.contact.contactError,
        isContactPostPending: state.contact.isContactPostPending,
        contactPostError: state.contact.contactPostError,
        isContactPutPending: state.contact.isContactPutPending,
        contactPutError: state.contact.contactPutError,
        isContactDeletePending: state.contact.isContactDeletePending,
        contactDeleteError: state.contact.contactDeleteError,
        noteList: state.noteList.notes,
        isNoteListPending: state.noteList.isNoteListPending,
        eventList: state.eventList.events,
        isEventListPending: state.eventList.isEventListPending,
        isRelationListPending: state.relationList.isRelationListPending
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContact,
            putContact,
            postContact,
            deleteContact,
            getNoteList,
            getEventList
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EditContact);
