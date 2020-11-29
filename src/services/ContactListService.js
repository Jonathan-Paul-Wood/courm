import axios from '../configs/axiosBasic';

export default class ContactListService {
    static getContactList() {
        return axios.get('/contacts');
    }
}