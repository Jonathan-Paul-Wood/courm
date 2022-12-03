import ContactsBrowse from './ContactsBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContactList } from '../../store/ContactList/actions';
import { getEventList } from '../../store/EventList/actions';
import { getNoteList } from '../../store/NoteList/actions';

function mapStateToProps (state) {
    return {
        contacts: state.contactList.contacts,
        isContactListPending: state.contactList.isContactListPending,
        contactListError: state.contactList.contactListError,
        events: state.eventList.events,
        isEventListPending: state.eventList.isEventListPending,
        eventListError: state.eventList.eventListError,
        notes: state.noteList.notes,
        isNoteListPending: state.noteList.isNoteListPending,
        noteListError: state.noteList.noteListError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContactList,
            getEventList,
            getNoteList
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ContactsBrowse);
