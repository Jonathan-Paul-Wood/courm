import axios from '../configs/axiosBasic';

export default class ContactListService {
    static getContactList(page, order, direction) {
        page = page || 1;
        const results = 10; //TODO: make configuratble variable?
        order = order || 'firstName';
        direction = direction === 'DESC' ? 'DESC' : 'ASC';
        return axios.get(`/contacts?results=${results}&page=${page}&order=${order}&direction=${direction}`);
    }
}