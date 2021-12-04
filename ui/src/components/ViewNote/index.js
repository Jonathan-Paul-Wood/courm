import ViewNote from './ViewNote';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getNote } from '../../store/Note/actions';
import { getContact } from '../../store/Contact/actions';

function mapStateToProps (state) {
    return {
        note: state.note.note,
        isNotePending: state.note.isNotePending,
        noteError: state.note.noteError,
        contact: state.contact.contact,
        isContactPending: state.contact.isContactPending,
        contactError: state.contact.contactError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getNote,
            getContact
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ViewNote);
