import axios from '../configs/axiosBasic';

export default class ContactListService {
    static getContactListMetadata(searchTerm) {
        return axios.get(`/contacts/metadata?searchTerm=${searchTerm}`);
    }

    static getContactList(results, page, searchTerm, order, direction) {
        results = results || 5;
        page = page || 1;
        order = order || 'firstName';
        return axios.get(`/contacts?results=${results}&page=${page}&order=${order}&direction=${direction}&searchTerm=${searchTerm}`);
    }
}