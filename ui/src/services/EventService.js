import axios from '../configs/axiosBasic';

export default class EventService {
    static getEvent (id) {
        return axios.get(`/events/${id}`);
    }

    static postEvent (body) {
        return axios.post('/events/new', body);
    }

    static putEvent (id, body) {
        return axios.put(`/events/${id}`, body);
    }

    static deleteEvent (id) {
        return axios.delete(`/events/${id}`);
    }
}
