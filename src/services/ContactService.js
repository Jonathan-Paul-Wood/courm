import { axiosInstance } from '../configs/axiosSingleton';

export default class ContactService {
    static getContactList() {
        return axiosInstance.get('/api/contacts');
    }
}