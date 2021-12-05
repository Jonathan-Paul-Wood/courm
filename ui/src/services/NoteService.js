import axios from '../configs/axiosBasic';

export default class NoteService {
    static getNote (id) {
        return axios.get(`/notes/${id}`);
    }

    static postNote (body) {
        return axios.post('/notes/new', body);
    }

    static putNote (id, body) {
        return axios.put(`/notes/${id}`, body);
    }

    static deleteNote (id) {
        return axios.delete(`/notes/${id}`);
    }
}
