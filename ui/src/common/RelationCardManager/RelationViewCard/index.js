import RelationViewCard from './RelationViewCard';
import { connect } from 'react-redux';

function mapStateToProps (state) {
    return {
        relationList: state.relationList.relations
    };
}

export default connect(mapStateToProps)(RelationViewCard);
