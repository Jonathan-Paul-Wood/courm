import ViewContact from './ViewContact';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContact } from '../../store/Contact/actions';

function mapStateToProps (state) {
    return {
        contact: state.contact.contact,
        isContactPending: state.contact.isContactPending,
        contactError: state.contact.contactError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContact
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ViewContact);
