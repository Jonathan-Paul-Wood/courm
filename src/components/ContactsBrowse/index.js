import ContactsBrowse from './ContactsBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContactList, getContactListMetadata } from '../../store/ContactList/actions';

function mapStateToProps(state) {
    return {
        contacts: state.contactList.contacts,
        isContactListPending: state.contactList.isContactListPending,
        contactListError: state.contactList.contactListError,
        contactsMetadata: state.contactList.contactsMetadata,
        isContactListMetadataPending: state.contactList.isContactListMetadataPending,
        contactListMetadataError: state.contactList.contactListMetadataError,
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContactList,
            getContactListMetadata
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ContactsBrowse);