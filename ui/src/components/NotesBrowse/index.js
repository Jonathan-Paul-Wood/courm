import NotesBrowse from './NotesBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getNoteList } from '../../store/NoteList/actions';

function mapStateToProps (state) {
    return {
        notes: state.noteList.notes,
        isNoteListPending: state.noteList.isNoteListPending,
        noteListError: state.noteList.noteListError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getNoteList
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(NotesBrowse);
