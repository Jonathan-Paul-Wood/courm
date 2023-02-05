import EventsBrowse from './EventsBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEventList } from '../../store/EventList/actions';
import { getAllContacts } from '../../store/ContactList/actions';
import { getAllNotes } from '../../store/NoteList/actions';

function mapStateToProps (state) {
    return {
        events: state.eventList.events,
        isEventListPending: state.eventList.isEventListPending,
        eventListError: state.eventList.eventListError,
        isAllContactsPending: state.contactList.isAllContactsPending,
        allContactsError: state.contactList.allContactsError,
        contacts: state.contactList.contacts,
        isAllNotesPending: state.noteList.isAllNotesPending,
        allNotesError: state.noteList.allNotesError,
        notes: state.noteList.notes
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getEventList,
            getAllContacts,
            getAllNotes
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EventsBrowse);
