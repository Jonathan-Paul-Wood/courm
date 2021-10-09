import * as types from './types';
import ServiceError from '../ServiceError';
import NoteService from '../../services/NoteService';
// todo: import notification toasts success/error

function getNoteLoading () {
    return {
        type: types.GET_NOTE_PENDING
    };
}
function getNoteSuccess (payload) {
    return {
        type: types.GET_NOTE_SUCCESS,
        payload
    };
}
function getNoteError (error) {
    return {
        type: types.GET_NOTE_ERROR,
        error: new ServiceError('get note ', error)
    };
}
export function getNote (id) {
    return async dispatch => {
        dispatch(getNoteLoading());
        try {
            const response = await NoteService.getNote(id);
            dispatch(getNoteSuccess(response));
        } catch (e) {
            dispatch(getNoteError(e));
        }
    };
}

function postNoteLoading () {
    return {
        type: types.POST_NOTE_PENDING
    };
}
function postNoteSuccess (payload) {
    return {
        type: types.POST_NOTE_SUCCESS,
        payload
    };
}
function postNoteError (error) {
    return {
        type: types.POST_NOTE_ERROR,
        error: new ServiceError('post note ', error)
    };
}
export function postNote (body) {
    return async dispatch => {
        dispatch(postNoteLoading());
        try {
            const response = await NoteService.postNote(body);
            dispatch(postNoteSuccess(response));
        } catch (e) {
            dispatch(postNoteError(e));
        }
    };
}

function putNoteLoading () {
    return {
        type: types.PUT_NOTE_PENDING
    };
}
function putNoteSuccess (payload) {
    return {
        type: types.PUT_NOTE_SUCCESS,
        payload
    };
}
function putNoteError (error) {
    return {
        type: types.PUT_NOTE_ERROR,
        error: new ServiceError('put note error ', error)
    };
}
export function putNote (id, body) {
    return async dispatch => {
        dispatch(putNoteLoading());
        try {
            const response = await NoteService.putNote(id, body);
            dispatch(putNoteSuccess(response));
        } catch (e) {
            dispatch(putNoteError(e));
        }
    };
}

function deleteNoteLoading () {
    return {
        type: types.DELETE_NOTE_PENDING
    };
}
function deleteNoteSuccess (payload) {
    return {
        type: types.DELETE_NOTE_SUCCESS,
        payload
    };
}
function deleteNoteError (error) {
    return {
        type: types.DELETE_NOTE_ERROR,
        error: new ServiceError('delete note error ', error)
    };
}
export function deleteNote (id) {
    return async dispatch => {
        dispatch(deleteNoteLoading());
        try {
            const response = await NoteService.deleteNote(id);
            dispatch(deleteNoteSuccess(response));
        } catch (e) {
            dispatch(deleteNoteError(e));
        }
    };
}
