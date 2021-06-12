import * as types from './types';

export const initialState = {
    contact: {
        "firstName": '',
        "lastName": '',
        "profilePicture": '',
        "phoneNumber": '',
        "email": '',
        "address": '',
        "firm": '',
        "industry": '',
        "dateOfBirth": '',
        "tags": '',
        "interactions": '',
        "createdBy": '',
        "createdOn": '',
        "lastModifiedBy": '',
        "lastModifiedOn": '',
        "lastInteractionId": '',
        "lastInteractionOn": '',
        "entityType": 'person'
    },
    isContactPending: false,
    contactError: '',
    isContactPostPending: false,
    contactPostError: '',
    isContactPutPending: false,
    contactPutError: '',
    isContactDeletePending: false,
    contactDeleteError: '',
}

export default function contact(state = initialState, action) {
    switch (action.type) {
        case types.GET_CONTACT_PENDING:
            return { ...state, isContactPending: true, contactError: '' };
        case types.GET_CONTACT_ERROR:
            return { ...state, isContactPending: false, contactError: action.error }
        case types.GET_CONTACT_SUCCESS:
            return { ...state, isContactPending: false, contactError: '', contact: action.payload.data }
        case types.POST_CONTACT_PENDING:
            return { ...state, isContactPostPending: true, contactPostError: '' };
        case types.POST_CONTACT_ERROR:
            return { ...state, isContactPostPending: false, contactPostError: action.error }
        case types.POST_CONTACT_SUCCESS:
            return { ...state, isContactPostPending: false, contactPostError: '' }
        case types.PUT_CONTACT_PENDING:
            return { ...state, isContactPutPending: true, contactPutError: '' };
        case types.PUT_CONTACT_ERROR:
            return { ...state, isContactPutPending: false, contactPutError: action.error }
        case types.PUT_CONTACT_SUCCESS:
            return { ...state, isContactPutPending: false, contactPutError: '' }
            case types.DELETE_CONTACT_PENDING:
                return { ...state, isContactDeletePending: true, contactDeleteError: '' };
            case types.DELETE_CONTACT_ERROR:
                return { ...state, isContactDeletePending: false, contactDeleteError: action.error }
            case types.DELETE_CONTACT_SUCCESS:
                return { ...state, isContactDeletePending: false, contactDeleteError: '' }
        default:
            return state;
    }
}