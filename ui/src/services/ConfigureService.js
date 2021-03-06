import axios from '../configs/axiosBasic';

export default class ConfigureService {
    static addContacts (json) {
        return axios.post(`/configure/contacts/add?contacts=${json}`);
    }

    static initializeDB () {
        return axios.post('/initialize');
    }
}
