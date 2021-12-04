import * as types from './types';
import ServiceError from '../ServiceError';
import NoteListService from '../../services/NoteListService';
// todo: import notification toasts success/error

function getNoteListLoading () {
    return {
        type: types.GET_NOTE_LIST_PENDING
    };
}

function getNoteListSuccess (payload) {
    return {
        type: types.GET_NOTE_LIST_SUCCESS,
        payload
    };
}

function getNoteListError (error) {
    return {
        type: types.GET_NOTE_LIST_ERROR,
        error: new ServiceError('get notes list', error)
    };
}

export function getNoteList (results, page, searchTerm, order, direction, filters) {
    return async dispatch => {
        dispatch(getNoteListLoading());
        try {
            const response = await NoteListService.getNoteList(results, page, searchTerm, order, direction, filters);
            dispatch(getNoteListSuccess(response));
        } catch (e) {
            dispatch(getNoteListError(e));
        }
    };
}
