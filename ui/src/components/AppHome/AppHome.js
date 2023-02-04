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

    .link {
        color: blue;
        text-decoration-line: underline;
        cursor: pointer;
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
            <h2>Welcome to CouRM <span style={{ color: 'red' }}>BETA</span></h2>
            <h4>Use this personal CRM / Address Book to keep track of your contacts!</h4>
            <h2>Common Actions</h2>
            <ul className="action-list">
                <li onClick={() => handleActionSelection('create', 'contacts')}>Create Contact</li>
                <li onClick={() => navigate('/notes/new')}>Record Note</li>
                <li onClick={() => handleActionSelection('view', 'contacts')}>View & Search Contacts</li>
                <li onClick={() => navigate('/notes')}>View & Search Notes</li>
            </ul>
            <h2>Background</h2>
            <p>
                We're looking to create an intuitive tool that lets you track your social and professional life without the all-seeing eye of social media and other panopticons. We're still very early in this journey and would love to hear your feedback! Checkout the <span className="link" onClick={() => navigate('/faq')}>FAG page</span> if you have questions, and have a wonderful day!
            </p>
        </HomeWrapper>
    );
}

AppHome.propTypes = {
    initializeDB: PropTypes.func.isRequired,
    isInitializingDB: PropTypes.bool.isRequired,
    initializeDBError: PropTypes.string.isRequired
};
