import MainToolbar from './MainToolbar';
import { connect } from 'react-redux';

function mapStateToProps (state) {
    return {
        contactList: state.contactList.contacts,
        noteList: state.noteList.notes
    };
}

export default connect(mapStateToProps)(MainToolbar);
