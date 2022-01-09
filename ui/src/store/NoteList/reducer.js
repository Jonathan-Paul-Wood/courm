import * as types from './types';

export const initialState = {
    notes: {},
    isNoteListPending: true,
    noteListError: ''
};

export default function note (state = initialState, action) {
    switch (action.type) {
    case types.GET_NOTE_LIST_PENDING:
        return { ...state, isNoteListPending: true, noteListError: '' };
    case types.GET_NOTE_LIST_ERROR:
        return { ...state, isNoteListPending: false, noteListError: action.error };
    case types.GET_NOTE_LIST_SUCCESS:
        return { ...state, isNoteListPending: false, noteListError: '', notes: action.payload.data };
    default:
        return state;
    }
}
