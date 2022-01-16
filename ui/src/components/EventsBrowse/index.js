import eventBrowse from './eventBrowse';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEventList } from '../../store/EventList/actions';

function mapStateToProps (state) {
    return {
        event: state.eventList.event,
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

export default connect(mapStateToProps, mapDispatchToProps)(eventBrowse);
