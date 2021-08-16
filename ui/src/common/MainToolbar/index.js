import MainToolbar from './MainToolbar';
import { connect } from 'react-redux';

function mapStateToProps (state) {
    return {
        contactList: state.contactList.contacts
    };
}

export default connect(mapStateToProps)(MainToolbar);
