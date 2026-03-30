import RelationEditCard from './RelationEditCard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRelationList } from '../../../store/RelationList/actions';
import { postRelation, deleteRelation } from '../../../store/Relation/actions';

function mapStateToProps (state) {
    return {
        relationList: state.relationList.relations,
        isRelationListPending: state.relationList.isRelationListPending
    };
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            getRelationList,
            postRelation,
            deleteRelation
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RelationEditCard);
