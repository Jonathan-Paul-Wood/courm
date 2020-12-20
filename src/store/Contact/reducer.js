import * as types from './types';

export const initialState = {
    contact: {
        "firstName": null,
        "lastName": null,
        "profilePicture": null,
        "phoneNumber": null,
        "email": null,
        "address": null,
        "firm": null,
        "industry": null,
        "dateOfBirth": null,
        "tags": null,
        "interactions": null,
        "createdBy": null,
        "createdOn": null,
        "lastModifiedBy": null,
        "lastModifiedOn": null,
        "lastInteractionId": null,
        "lastInteractionOn": null,
        "entityType": null
    },
    isContactPending: false,
    contactError: '',
    isContactPostPending: false,
    contactPostError: '',
    isContactPutPending: false,
    contactPutError: '',
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
        default:
            return state;
    }
}