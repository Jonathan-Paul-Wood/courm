import RelationEditCard from './RelationEditCard';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { postRelation, putRelation, deleteRelation } from '../../store/Relation/actions';

function mapStateToProps (state) {
    return {
        relationList: state.relationList.relations
    };
}
const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            postRelation,
            putRelation,
            deleteRelation
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(RelationEditCard);
