import axios from '../configs/axiosBasic';

export default class ContactListService {
    static getContactList (results, page, searchTerm, order, direction, filters) {
        // to GET all contacts, pass results = number of total contacts, and page = 1
        results = results || 5;
        page = page || 1;
        order = order || 'firstName';
        direction = direction || 'ASC';
        searchTerm = searchTerm || '';
        return axios.get(`/contacts?results=${results}&page=${page}&order=${order}&direction=${direction}&searchTerm=${searchTerm}&filters=${filters}`);
    }
}
