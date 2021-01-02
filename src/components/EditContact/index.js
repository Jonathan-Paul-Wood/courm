import EditContact from './EditContact';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContact, putContact, postContact, deleteContact } from '../../store/Contact/actions';

function mapStateToProps(state) {
    return {
        contact: state.contact.contact,
        isContactPending: state.contact.isContactPending,
        contactError: state.contact.contactError,
        isContactPostPending: state.contact.isContactPostPending,
        contactPostError: state.contact.contactPostError,
        isContactPutPending: state.contact.isContactPutPending,
        contactPutError: state.contact.contactPutError,
        isContactDeletePending: state.contact.isContactDeletePending,
        contactDeleteError: state.contact.contactDeleteError,
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContact,
            putContact,
            postContact,
            deleteContact
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EditContact);