import * as types from './types';

export const initialState = {
    notes: {},
    isNoteListPending: true,
    noteListError: '',
    isAllNotesPending: true,
    allNotesError: ''
};

export default function note (state = initialState, action) {
    switch (action.type) {
    case types.GET_NOTE_LIST_PENDING:
        return { ...state, isNoteListPending: true, noteListError: '' };
    case types.GET_NOTE_LIST_ERROR:
        return { ...state, isNoteListPending: false, noteListError: action.error };
    case types.GET_NOTE_LIST_SUCCESS:
        return { ...state, isNoteListPending: false, noteListError: '', notes: action.payload.data };
    case types.GET_ALL_NOTES_PENDING:
        return { ...state, isAllNotesPending: true, allNotesError: '' };
    case types.GET_ALL_NOTES_ERROR:
        return { ...state, isAllNotesPending: false, allNotesError: action.error };
    case types.GET_ALL_NOTES_SUCCESS:
        return { ...state, isAllNotesPending: false, allNotesError: '', notes: action.payload.data };
    default:
        return state;
    }
}
