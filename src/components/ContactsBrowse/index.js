import ContactsBrowse from './ContactsBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContactList } from '../../store/ContactList/actions';

function mapStateToProps(state) {
    return {
        contacts: state.contactList.contacts,
        isContactListPending: state.contactList.isContactListPending,
        contactListError: state.contactList.contactListError,
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContactList
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ContactsBrowse);