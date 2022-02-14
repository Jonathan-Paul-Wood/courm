import axios from '../configs/axiosBasic';

export default class RelationService {
    static postRelation (body) {
        return axios.post('/relations/new', body);
    }

    static putRelation (id, body) {
        return axios.put(`/relations/${id}`, body);
    }

    static deleteRelation (id) {
        return axios.delete(`/relations/${id}`);
    }
}
