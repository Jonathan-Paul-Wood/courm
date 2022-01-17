import AppConfigure from './AppConfigure';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContactList } from '../../store/ContactList/actions';
import { postContact, deleteContact } from '../../store/Contact/actions';
import { getNoteList } from '../../store/NoteList/actions';
import { postNote, deleteNote } from '../../store/Note/actions';

function mapStateToProps (state) {
    return {
        contacts: state.contactList.contacts,
        isContactListPending: state.contactList.isContactListPending,
        contactListError: state.contactList.contactListError,
        isContactPostPending: state.contact.isContactPostPending,
        contactPostError: state.contact.contactPostError,
        isContactDeletePending: state.contact.isContactDeletePending,
        contactDeleteError: state.contact.contactDeleteError,
        notes: state.noteList.notes,
        isNoteListPending: state.noteList.isNoteListPending,
        noteListError: state.noteList.noteListError,
        isNotePostPending: state.note.isNotePostPending,
        notePostError: state.note.notePostError,
        isNoteDeletePending: state.note.isNoteDeletePending,
        noteDeleteError: state.note.noteDeleteError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContactList,
            postContact,
            deleteContact,
            getNoteList,
            postNote,
            deleteNote
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigure);
