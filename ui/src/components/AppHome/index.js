import AppHome from './AppHome';
import { connect } from 'react-redux';

function mapStateToProps (state) {
    return {
        isInitializingDB: state.configure.isInitializingDB,
        initializeDBError: state.configure.initializeDBError
    };
}

export default connect(mapStateToProps)(AppHome);
