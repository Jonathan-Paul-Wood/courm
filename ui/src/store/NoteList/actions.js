import * as types from './types';
import ServiceError from '../ServiceError';
import NoteListService from '../../services/NoteListService';
import { runNotifiedRequest } from '../actionNotifications';

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

export function getNoteList (results, page, searchTerm, order, direction, filters, appliedContacts, appliedEvents, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getNoteListLoading,
            successAction: getNoteListSuccess,
            errorAction: getNoteListError,
            errorContext: 'get notes list',
            serviceCall: () => NoteListService.getNoteList(results, page, searchTerm, order, direction, filters, appliedContacts, appliedEvents),
            defaultErrorMessage: 'Unable to load notes.',
            notificationOptions: {
                toastId: 'note-list-load-error',
                ...notificationOptions
            }
        });
    };
}

function getAllNotesLoading () {
    return {
        type: types.GET_ALL_NOTES_PENDING
    };
}

function getAllNotesSuccess (payload) {
    return {
        type: types.GET_ALL_NOTES_SUCCESS,
        payload
    };
}

function getAllNotesError (error) {
    return {
        type: types.GET_ALL_NOTES_ERROR,
        error: new ServiceError('get notes list', error)
    };
}

export function getAllNotes (notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getAllNotesLoading,
            successAction: getAllNotesSuccess,
            errorAction: getAllNotesError,
            errorContext: 'get notes list',
            serviceCall: () => NoteListService.getAllNotes(),
            defaultErrorMessage: 'Unable to load notes.',
            notificationOptions: {
                toastId: 'all-notes-load-error',
                ...notificationOptions
            }
        });
    };
}
