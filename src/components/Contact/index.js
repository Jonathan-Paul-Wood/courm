import Contact from './Contact';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContact } from '../../store/Contact/actions';

function mapStateToProps(state) {
    return {
        contact: state.contact.contacts,
        isContactPending: state.contact.isContactPending,
        contactError: state.contact.contactError,
        id: state.contactId,
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContact
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(Contact);