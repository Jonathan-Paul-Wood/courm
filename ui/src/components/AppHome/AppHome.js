import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const HomeWrapper = styled.div`
    padding: 0 1em;

    .action-list {
        li:hover {
            cursor: pointer;
            background-color: #f2f2f2;
        }
    }
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
            <ul className="action-list">
                <li onClick={() => history.push('/contacts/new')}>Create Contact</li>
                {/* <li onClick={() => history.push('/interactions/new')}>Record Interaction</li> */}
                <li onClick={() => history.push('/contacts')}>View & Search Contacts</li>
                {/* <li onClick={() => history.push('/interactions')}>View & Search Interactions</li> */}
            </ul>
        </HomeWrapper>
    );
}