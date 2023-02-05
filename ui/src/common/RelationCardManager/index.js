import RelationCardManager from './RelationCardManager';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRelationList } from '../../store/RelationList/actions';
import { getAllContacts } from '../../store/ContactList/actions';
import { getAllNotes } from '../../store/NoteList/actions';
import { getAllEvents } from '../../store/EventList/actions';

function mapStateToProps (state) {
    return {
        contactList: state.contactList.contacts,
        isAllContactsPending: state.contactList.isAllContactsPending,
        eventList: state.eventList.events,
        isAllEventsPending: state.eventList.isAllEventsPending,
        noteList: state.noteList.notes,
        isAllNotesPending: state.noteList.isAllNotesPending,
        relationList: state.relationList.relations,
        isRelationListPending: state.relationList.isRelationListPending,
        isRelationPostPending: state.relation.isRelationPostPending,
        isRelationPutPending: state.relation.isRelationPutPending,
        isRelationDeletePending: state.relation.isRelationDeletePending
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getAllContacts,
            getAllEvents,
            getAllNotes,
            getRelationList
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RelationCardManager);
