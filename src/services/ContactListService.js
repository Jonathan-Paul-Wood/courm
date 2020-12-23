import axios from '../configs/axiosBasic';

export default class ContactListService {
    static getContactListMetadata() {
        return axios.get(`/contacts/metadata`);
    }

    static getContactList(results, page, order, direction) {
        results = results || 5;
        page = page || 1;
        order = order || 'firstName';
        direction = direction === 'DESC' ? 'DESC' : 'ASC';
        return axios.get(`/contacts?results=${results}&page=${page}&order=${order}&direction=${direction}`);
    }
}