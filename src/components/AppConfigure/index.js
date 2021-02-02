import AppConfigure from './AppConfigure';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addContacts } from '../../store/Configure/actions';

function mapStateToProps(state) {
    return {
        isAddContactsPending: state.configure.isAddContactsPending,
        addContactsError: state.configure.addContactsError,
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            addContacts,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(AppConfigure);