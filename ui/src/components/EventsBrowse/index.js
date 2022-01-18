import EventsBrowse from './EventsBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEventList } from '../../store/EventList/actions';

function mapStateToProps (state) {
    return {
        events: state.eventList.events,
        isEventListPending: state.eventList.isEventListPending,
        eventListError: state.eventList.eventListError
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getEventList
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(EventsBrowse);
