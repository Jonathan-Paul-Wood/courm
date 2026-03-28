import CalendarBrowse from './CalendarBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getAllEvents } from '../../store/EventList/actions';
import { getAllNotes } from '../../store/NoteList/actions';
import { getAllContacts } from '../../store/ContactList/actions';
import { getAllRelations } from '../../store/RelationList/actions';

function mapStateToProps (state) {
    return {
        events: state.eventList.events,
        notes: state.noteList.notes,
        contacts: state.contactList.contacts,
        relations: state.relationList.relations,
        isAllEventsPending: state.eventList.isAllEventsPending,
        isAllNotesPending: state.noteList.isAllNotesPending,
        isAllContactsPending: state.contactList.isAllContactsPending,
        isRelationListPending: state.relationList.isRelationListPending
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getAllEvents,
            getAllNotes,
            getAllContacts,
            getAllRelations
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(CalendarBrowse);
