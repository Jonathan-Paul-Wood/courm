import axios from '../configs/axiosBasic';

export default class RelationListService {
    static getRelationList (entity, id) {
        // to GET all relations for a given entity
        return axios.get(`/relations?identifier=${entity}&id=${id}`);
    }
}
