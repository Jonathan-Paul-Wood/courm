import axios from '../configs/axiosBasic';

export default class ContactService {
    static getContact (id) {
        return axios.get(`/contacts/${id}`);
    }

    static postContact (body) {
        return axios.post('/contacts/new', body);
    }

    static putContact (id, body) {
        return axios.put(`/contacts/${id}`, body);
    }

    static deleteContact (id) {
        return axios.delete(`/contacts/${id}`);
    }
}
