import ContactsBrowse from './ContactsBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContactList } from '../../store/Contact/actions';

function mapStateToProps(state) {
    return {
        contacts: state.contact.contacts,
        isContactListPending: state.contact.isContactListPending,
        contactListError: state.contact.contactListError,
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