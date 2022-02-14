import RelationCardManager from './RelationCardManager';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRelationList } from '../../store/RelationList/actions';
import { getContactList } from '../../store/ContactList/actions';
import { getNoteList } from '../../store/NoteList/actions';
import { getEventList } from '../../store/EventList/actions';

function mapStateToProps (state) {
    return {
        contactList: state.contactList.contacts,
        isContactListPending: state.contactList.isContactListPending,
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
            getContactList,
            getEventList,
            getNoteList,
            getRelationList
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RelationCardManager);
