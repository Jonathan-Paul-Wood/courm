import EditEvent from './EditEvent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEvent, putEvent, postEvent, deleteEvent } from '../../store/Event/actions';

function mapStateToProps (state) {
    return {
        event: state.event.event,
        isEventPending: state.event.isEventPending,
        eventError: state.event.eventError,
        isEventPostPending: state.event.isEventPostPending,
        eventPostError: state.event.eventPostError,
        isEventPutPending: state.event.isEventPutPending,
        eventPutError: state.event.eventPutError,
        isEventDeletePending: state.event.isEventDeletePending,
        eventDeleteError: state.event.eventDeleteError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getEvent,
            putEvent,
            postEvent,
            deleteEvent
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EditEvent);
