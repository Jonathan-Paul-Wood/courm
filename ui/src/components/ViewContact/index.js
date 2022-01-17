import ViewContact from './ViewContact';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContact } from '../../store/Contact/actions';
import { getRelationList } from '../../store/RelationList/actions';

function mapStateToProps (state) {
    return {
        contact: state.contact.contact,
        isContactPending: state.contact.isContactPending,
        contactError: state.contact.contactError,
        relationList: state.relationList.relations,
        isRelationListPending: state.relationList.isRelationListPending
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getContact,
            getRelationList
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(ViewContact);
