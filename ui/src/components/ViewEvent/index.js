import ViewEvent from './ViewEvent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEvent } from '../../store/Event/actions';
import { getContact } from '../../store/Contact/actions';

function mapStateToProps (state) {
    return {
        event: state.event.event,
        isEventPending: state.event.isEventPending,
        eventError: state.event.eventError,
        contact: state.contact.contact,
        isContactPending: state.contact.isContactPending,
        contactError: state.contact.contactError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getEvent,
            getContact
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ViewEvent);
