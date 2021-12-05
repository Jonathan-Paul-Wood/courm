import EditNote from './EditNote';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getNote, putNote, postNote, deleteNote } from '../../store/Note/actions';

function mapStateToProps (state) {
    return {
        note: state.note.note,
        isNotePending: state.note.isNotePending,
        noteError: state.note.noteError,
        isNotePostPending: state.note.isNotePostPending,
        notePostError: state.note.notePostError,
        isNotePutPending: state.note.isNotePutPending,
        notePutError: state.note.notePutError,
        isNoteDeletePending: state.note.isNoteDeletePending,
        noteDeleteError: state.note.noteDeleteError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getNote,
            putNote,
            postNote,
            deleteNote
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EditNote);
