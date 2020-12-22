import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const HomeWrapper = styled.div`
    padding: 0 1em;
`;

export default function AppHome() {
    const history = useHistory();

    function handleActionSelection(action, object) {
        switch (action) {
            case 'view':
                history.push(`${object}`);
            case 'create':
                history.push(`${object}/new`);
            default:
                console.log('error, invalid action: ', action);
        }
    }

    return (
        <HomeWrapper>
            <h2>Welcome</h2>
            <h4>Use this personal CRM / Address Book to keep track of your contacts!</h4>
            <h2>Actions</h2>
            <ul>
                <li><a onClick={() => history.push('/contacts/new')}>Create Contact</a></li>
                <li><a onClick={() => history.push('/interactions/new')}>Record Interaction</a></li>
                <li><a onClick={() => history.push('/contacts')}>View & Search Contacts</a></li>
                <li><a onClick={() => history.push('/interactions')}>View & Search Interactions</a></li>
            </ul>
        </HomeWrapper>
    );
}