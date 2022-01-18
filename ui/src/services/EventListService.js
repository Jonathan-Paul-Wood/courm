import axios from '../configs/axiosBasic';

export default class EventListService {
    static getEventList (results, page, searchTerm, order, direction, filters) {
        // to GET all events, pass results = number of total events, and page = 1
        results = results || 5;
        page = page || 1;
        order = order || 'title';
        direction = direction || 'ASC';
        searchTerm = searchTerm || '';
        return axios.get(`/events?results=${results}&page=${page}&order=${order}&direction=${direction}&searchTerm=${searchTerm}&filters=${filters}`);
    }
}
