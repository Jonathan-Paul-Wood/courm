import React from 'react';
import { screen, render, fireEvent } from '@testing-library/react';
import Button from './Button';

const props = {
    label: 'Test String',
    onClick: jest.fn()
};

describe('Test Button status and actions', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders active button', () => {
        render(<Button {...props} />);
        expect(screen.queryByText('Test String')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(props.onClick).toHaveBeenCalledTimes(1);
    });

    it('does not activate if disabled', () => {
        render(<Button {...props} disabled={true} />);

        fireEvent.click(screen.getByRole('button'));
        expect(props.onClick).toHaveBeenCalledTimes(0);
    });

    it('does not activate if pending', () => {
        render(<Button {...props} isPending={true} />);

        fireEvent.click(screen.getByRole('button'));
        expect(props.onClick).toHaveBeenCalledTimes(0);
    });
});
