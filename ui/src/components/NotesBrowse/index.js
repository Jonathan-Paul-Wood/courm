import NotesBrowse from './NotesBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getNoteList } from '../../store/NoteList/actions';
import { getAllContacts } from '../../store/ContactList/actions';
import { getAllEvents } from '../../store/EventList/actions';

function mapStateToProps (state) {
    return {
        notes: state.noteList.notes,
        isNoteListPending: state.noteList.isNoteListPending,
        noteListError: state.noteList.noteListError,
        contacts: state.contactList.contacts,
        isAllContactsPending: state.contactList.isAllContactsPending,
        allContactsError: state.contactList.allContactsError,
        events: state.eventList.events,
        isAllEventsPending: state.eventList.isAllEventsPending,
        allEventsError: state.eventList.allEventsError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getNoteList,
            getAllContacts,
            getAllEvents
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(NotesBrowse);
