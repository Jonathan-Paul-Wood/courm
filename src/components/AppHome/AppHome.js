import React from 'react';
import { useHistory } from 'react-router-dom';

export default function AppHome() {
    const history = useHistory();

    function handleActionSelection(action, object) {
        switch (action) {
            case 'view':
                history.push(`/${object}`);
            case 'create':
                history.push(`/${object}/new`);
            default:
                console.log('error, invalid action: ', action);
        }
    }

    return (
        <React.Fragment>
            <h2>Welcome</h2>
            <h4>Use this personal CRM / Address Book to keep track of your contacts!</h4>
            <h2>Actions</h2>
            <ul>
                <li><a onClick={() => handleActionSelection('create', 'contacts')}>Create Contact</a></li>
                <li><a onClick={() => handleActionSelection('create', 'interactions')}>Record Interaction</a></li>
                <li><a onClick={() => handleActionSelection('view', 'contacts')}>View & Search Contacts</a></li>
                <li><a onClick={() => handleActionSelection('view', 'interactions')}>View & Search Interactions Contact</a></li>
            </ul>
        </React.Fragment>
    );
}