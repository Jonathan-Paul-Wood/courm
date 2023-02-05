import ContactsBrowse from './ContactsBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContactList } from '../../store/ContactList/actions';
import { getAllEvents } from '../../store/EventList/actions';
import { getAllNotes } from '../../store/NoteList/actions';

function mapStateToProps (state) {
    return {
        contacts: state.contactList.contacts,
        isContactListPending: state.contactList.isContactListPending,
        contactListError: state.contactList.contactListError,
        events: state.eventList.events,
        isAllEventsPending: state.eventList.isAllEventsPending,
        allEventsError: state.eventList.allEventsError,
        notes: state.noteList.notes,
        isAllNotesPending: state.noteList.isAllNotesPending,
        allNotesError: state.noteList.allNotesError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContactList,
            getAllEvents,
            getAllNotes
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ContactsBrowse);
