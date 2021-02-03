import AppConfigure from './AppConfigure';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContactListMetadata, getContactList } from '../../store/ContactList/actions';
import { postContact, deleteContact } from '../../store/Contact/actions';

function mapStateToProps(state) {
    return {
        contacts: state.contactList.contacts,
        isContactListPending: state.contactList.isContactListPending,
        contactListError: state.contactList.contactListError,
        contactsMetadata: state.contactList.contactsMetadata,
        isContactListMetadataPending: state.contactList.isContactListMetadataPending,
        isContactListMetadataError: state.contactList.isContactListMetadataError,
        isContactPostPending: state.contact.isContactPostPending,
        contactPostError: state.contact.contactPostError,
        isContactDeletePending: state.contact.isContactDeletePending,
        contactDeleteError: state.contact.contactDeleteError,
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContactListMetadata,
            getContactList,
            postContact,
            deleteContact,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigure);