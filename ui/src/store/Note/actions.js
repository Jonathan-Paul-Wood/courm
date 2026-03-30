import * as types from './types';
import ServiceError from '../ServiceError';
import NoteService from '../../services/NoteService';
import { runNotifiedRequest } from '../actionNotifications';

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
export function getNote (id, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: getNoteLoading,
            successAction: getNoteSuccess,
            errorAction: getNoteError,
            errorContext: 'get note',
            serviceCall: () => NoteService.getNote(id),
            defaultErrorMessage: 'Unable to load note.',
            notificationOptions: {
                toastId: `note-load-${id}-error`,
                ...notificationOptions
            }
        });
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
export function postNote (body, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: postNoteLoading,
            successAction: postNoteSuccess,
            errorAction: postNoteError,
            errorContext: 'post note',
            serviceCall: () => NoteService.postNote(body),
            defaultSuccessMessage: 'Note created.',
            defaultErrorMessage: 'Unable to create note.',
            notificationOptions
        });
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
export function putNote (id, body, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: putNoteLoading,
            successAction: putNoteSuccess,
            errorAction: putNoteError,
            errorContext: 'put note error',
            serviceCall: () => NoteService.putNote(id, body),
            defaultSuccessMessage: 'Note updated.',
            defaultErrorMessage: 'Unable to update note.',
            notificationOptions
        });
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
export function deleteNote (id, notificationOptions = {}) {
    return async dispatch => {
        return runNotifiedRequest({
            dispatch,
            pendingAction: deleteNoteLoading,
            successAction: deleteNoteSuccess,
            errorAction: deleteNoteError,
            errorContext: 'delete note error',
            serviceCall: () => NoteService.deleteNote(id),
            defaultSuccessMessage: 'Note deleted.',
            defaultErrorMessage: 'Unable to delete note.',
            notificationOptions
        });
    };
}
