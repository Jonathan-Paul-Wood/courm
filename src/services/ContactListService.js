import axios from '../configs/axiosBasic';

export default class ContactListService {
    static getContactListMetadata() {
        return axios.get(`/contacts/metadata`);
    }

    static getContactList(page, order, direction) {
        const results = 3; //TODO: make configuratble variable?
        page = page || 1;
        order = order || 'firstName';
        direction = direction === 'DESC' ? 'DESC' : 'ASC';
        return axios.get(`/contacts?results=${results}&page=${page}&order=${order}&direction=${direction}`);
    }
}