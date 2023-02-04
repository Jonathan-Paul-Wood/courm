import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const HomeWrapper = styled.div`
    padding: 0 1em;

    .action-list {
        li:hover {
            cursor: pointer;
            background-color: #f2f2f2;
        }
    }
`;

export default function AppHome (props) {
    const { initializeDB } = props;
    const navigate = useNavigate();

    function handleActionSelection (action, object) {
        switch (action) {
        case 'view':
            navigate(`/${object}`);
            break;
        case 'create':
            navigate(`/${object}/new`);
            break;
        default:
            console.log('error, invalid action: ', action);
        }
    }

    useEffect(() => {
        // initialize the DB on startup - ensures tables exist if not already created
        initializeDB();
    }, []);

    return (
        <HomeWrapper>
            <h2>Welcome</h2>
            <h4>Use this personal CRM / Address Book to keep track of your contacts!</h4>
            <h2>Actions</h2>
            <ul className="action-list">
                <li onClick={() => handleActionSelection('create', 'contacts')}>Create Contact</li>
                <li onClick={() => navigate('/notes/new')}>Record Note</li>
                <li onClick={() => handleActionSelection('view', 'contacts')}>View & Search Contacts</li>
                <li onClick={() => navigate('/notes')}>View & Search Notes</li>
            </ul>
        </HomeWrapper>
    );
}

AppHome.propTypes = {
    initializeDB: PropTypes.func.isRequired,
    isInitializingDB: PropTypes.bool.isRequired,
    initializeDBError: PropTypes.string.isRequired
};
