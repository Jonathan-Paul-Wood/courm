import AppHome from './AppHome';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { initializeDB } from '../../store/Configure/actions';

//import functions from store/actions

function mapStateToProps(state) {
    return {
        isInitializingDB: state.configure.isInitializingDB,
        initializeDBError: state.configure.initializeDBError,
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            initializeDB
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(AppHome);