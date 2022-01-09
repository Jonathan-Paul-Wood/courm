import React from 'react';
import { screen, render } from '@testing-library/react';
import ViewContact from './ViewContact';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const props = {
    isContactPending: false,
    contactError: '',
    getContact: jest.fn(),
    contact: {
        id: 8,
        firstName: 'John',
        lastName: 'Smith',
        profilePicture: '',
        phoneNumber: '111-222-3333',
        email: 'john.smith@protonmail.com',
        address: '123 4th Street City, DC, 77007',
        firm: 'Company',
        industry: 'Professional',
        dateOfBirth: '1990-01-12T04:00:00.000Z',
        tags: '',
        interactions: '',
        createdBy: '',
        createdOn: '2021-01-24T20:52:41.921Z',
        lastModifiedBy: '',
        lastModifiedOn: '2021-02-04T23:08:48.053Z',
        lastInteractionId: '',
        lastInteractionOn: '',
        entityType: 'person',
        bio: 'An end, not a means'
    }
};

describe('Test ViewContacts and displayed values', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    const history = createMemoryHistory();
    history.push('/contacts/8');

    it('Displays loaded contact values in header and textboxes', () => {
        render(<Router history={history}>
            <ViewContact {...props} />
        </Router>);

        const title = screen.getByRole('heading', { class: 'pageTitle' });
        expect(title.title).toEqual('John Smith');

        const inputs = screen.getAllByRole('textbox', { type: 'text' });
        expect(inputs[0].value).toEqual('John');
        expect(inputs[1].value).toEqual('Smith');

        expect(inputs[2].value).toEqual('john.smith@protonmail.com');
        expect(inputs[3].value).toEqual('111-222-3333');

        expect(inputs[4].value).toEqual('Company');
        expect(inputs[5].value).toEqual('1990-01-11');

        expect(inputs[6].value).toEqual('123 4th Street City, DC, 77007');
        expect(inputs[7].value).toEqual('Professional');

        expect(inputs[8].value).toEqual('An end, not a means');
    });
});
