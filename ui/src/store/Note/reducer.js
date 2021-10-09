import * as types from './types';

export const initialState = {
    note: {
        title: '',
        date: '',
        record: '',
        address: '',
        contacts: '',
        createdOn: '',
        lastModifiedOn: ''
    },
    isNotePending: false,
    noteError: '',
    isNotePostPending: false,
    notePostError: '',
    isNotePutPending: false,
    notePutError: '',
    isNoteDeletePending: false,
    noteDeleteError: ''
};

export default function note (state = initialState, action) {
    switch (action.type) {
    case types.GET_NOTE_PENDING:
        return { ...state, isNotePending: true, noteError: '' };
    case types.GET_NOTE_ERROR:
        return { ...state, isNotePending: false, noteError: action.error };
    case types.GET_NOTE_SUCCESS:
        return { ...state, isNotePending: false, noteError: '', note: action.payload.data };
    case types.POST_NOTE_PENDING:
        return { ...state, isNotePostPending: true, notePostError: '' };
    case types.POST_NOTE_ERROR:
        return { ...state, isNotePostPending: false, notePostError: action.error };
    case types.POST_NOTE_SUCCESS:
        return { ...state, isNotePostPending: false, notePostError: '' };
    case types.PUT_NOTE_PENDING:
        return { ...state, isNotePutPending: true, notePutError: '' };
    case types.PUT_NOTE_ERROR:
        return { ...state, isNotePutPending: false, notePutError: action.error };
    case types.PUT_NOTE_SUCCESS:
        return { ...state, isNotePutPending: false, notePutError: '' };
    case types.DELETE_NOTE_PENDING:
        return { ...state, isNoteDeletePending: true, noteDeleteError: '' };
    case types.DELETE_NOTE_ERROR:
        return { ...state, isNoteDeletePending: false, noteDeleteError: action.error };
    case types.DELETE_NOTE_SUCCESS:
        return { ...state, isNoteDeletePending: false, noteDeleteError: '' };
    default:
        return state;
    }
};
