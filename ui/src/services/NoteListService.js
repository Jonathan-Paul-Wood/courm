import axios from '../configs/axiosBasic';

export default class NoteListService {
    static getNoteList (results, page, searchTerm, order, direction, filters) {
        // to GET all notes, pass results = number of total notes, and page = 1
        results = results || 5;
        page = page || 1;
        order = order || 'title';
        direction = direction || 'ASC';
        searchTerm = searchTerm || '';
        return axios.get(`/notes?results=${results}&page=${page}&order=${order}&direction=${direction}&searchTerm=${searchTerm}&filters=${filters}`);
    }
}
