import React from 'react';
import { screen, render } from '@testing-library/react';
import Button from './Button';

const props = {
    label: 'Test String',
    onClick: jest.fn()
}

describe('Test Button status and actions', () => {
    beforeEach(jest.resetAllMocks);

    it('renders active button', () => {
        render(<Button {...props} />);
        expect(screen.queryByText('Test String')).toBeInTheDocument();
    });
});



