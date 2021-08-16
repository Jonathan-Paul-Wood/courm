import App from './App';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

// import functions from store/actions

function mapStateToProps (state) {
    return {
        appConfig: state.appConfig
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            // those imported functions
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(App);
