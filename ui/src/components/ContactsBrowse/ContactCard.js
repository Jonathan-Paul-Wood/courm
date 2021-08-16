import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import icons from '../../assets/icons/bootstrapIcons';

const CardWrapper = styled.div`
    height: 15vh;
    background: #f2f2f2;
    border-radius: 4px;
    box-shadow: 2px 3px 2px #cccccc;
    margin: 0.5rem;
    padding: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;

    :hover {
        cursor: pointer;
        background-color: #e6e6e6;
        box-shadow: 4px 6px 4px #cccccc;
    }

    #head-wrapper {
        display: flex;
        justify-content: space-between;
        margin: 0.5em;
    }

    .card-content {
        margin: 0.5em;
        display: flex;
        justify-content: space-around;
    }

    #contact-name {
        max-width: 50rem;
        padding: 0 2rem;
    }

    .limit-content {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
`;

export default function ContactCard (props) {
    const { contact } = props;
    const history = useHistory();

    return (
        <CardWrapper className="a-cursor-pointer" onClick={() => history.push(`/contacts/${contact.id}`)}>
            <div id="head-wrapper">
                <div id="profile-picture">
                    {contact.profilePicture ? contact.profilePicture : icons.personCard}
                </div>
                <div id="contact-name" className="limit-content" title={contact.firstName + ' ' + contact.lastName}>
                    <b>{contact.firstName}</b> {contact.lastName}
                </div>
                <div>{/* TODO: link to contacts' notes, or something; for now this placeholder centers the name */}</div>
            </div>

            <div id="communcate-wrapper" className="card-content">
                <div>{contact.email}</div>
                <div>{contact.phoneNumber}</div>
            </div>
        </CardWrapper>
    );
}

ContactCard.propTypes = {
    contact: PropTypes.object.isRequired
};
