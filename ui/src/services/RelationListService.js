import axios from '../configs/axiosBasic';

export default class RelationListService {
    static getRelationList (entity, id) {
        // to GET all relations for a given entity
        return axios.get(`/relations?entity=${entity}&id=${id}`);
    }

    static getAllRelations () {
        return axios.get('/relations/all');
    }
}
