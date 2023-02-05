import RelationCardManager from './RelationCardManager';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRelationList } from '../../store/RelationList/actions';
import { getAllContacts } from '../../store/ContactList/actions';
import { getNoteList } from '../../store/NoteList/actions';
import { getEventList } from '../../store/EventList/actions';

function mapStateToProps (state) {
    return {
        contactList: state.contactList.contacts,
        isAllContactsPending: state.contactList.isAllContactsPending,
        eventList: state.eventList.events,
        isEventListPending: state.eventList.isEventListPending,
        noteList: state.noteList.notes,
        isNoteListPending: state.noteList.isNoteListPending,
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
            getEventList,
            getNoteList,
            getRelationList
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RelationCardManager);
