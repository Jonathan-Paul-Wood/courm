/* eslint-disable react/prop-types */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import RelationEditCard from './RelationEditCard';
import { showErrorToast } from '../../App/ToastWrapper/toastNotifications';

jest.mock('../../Button', () => function MockButton (props) {
    return (
        <button disabled={props.disabled} onClick={props.onClick}>
            {props.label || props.icon || 'button'}
        </button>
    );
});

jest.mock('../../Select', () => function MockSelect (props) {
    return (
        <select
            aria-label="relation-select"
            value={props.selectedIndex}
            onChange={event => props.onSelect(Number(event.target.value))}
        >
            {props.options.map((option, index) => (
                <option key={`${option.label}-${index}`} value={index}>{option.label}</option>
            ))}
        </select>
    );
});

jest.mock('../../ScrollContainer', () => function MockScrollContainer (props) {
    return <div>{props.children}</div>;
});

jest.mock('../../App/ToastWrapper/toastNotifications', () => ({
    showErrorToast: jest.fn(),
    showSuccessToast: jest.fn()
}));

describe('RelationEditCard bulk notifications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows one aggregate error toast and suppresses per-item toasts for relation updates', async () => {
        const deleteRelation = jest.fn().mockRejectedValue(new Error('delete failed'));
        const getRelationList = jest.fn().mockResolvedValue({ data: [] });

        render(
            <RelationEditCard
                relatedEntityList={[{ id: 2, firstName: 'Ada' }]}
                relationList={[{ id: 10, contactId: 2, noteId: 9 }]}
                postRelation={jest.fn()}
                deleteRelation={deleteRelation}
                getRelationList={getRelationList}
                parentType="note"
                parentId={9}
                relationType="contact"
                onChange={jest.fn()}
                labelTerm="firstName"
            />
        );

        await waitFor(() => expect(screen.getByText('Ada')).toBeInTheDocument());

        fireEvent.click(screen.getByText('minus'));
        fireEvent.click(screen.getByText('Confirm'));

        await waitFor(() => expect(deleteRelation).toHaveBeenCalledWith(10, {
            suppressSuccess: true,
            suppressError: true
        }));
        await waitFor(() => expect(getRelationList).toHaveBeenCalledWith('noteId', '9'));

        expect(showErrorToast).toHaveBeenCalledTimes(1);
        expect(showErrorToast.mock.calls[0][0]).toContain('1 failed');
    });
});
