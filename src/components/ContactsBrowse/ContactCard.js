import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import Button from '../../common/Button/Button';

const CardWrapper = styled.div`
    height: 15vh;
    background: #f2f2f2;
    border-radius: 4px;
    box-shadow: 2px 3px 2px #cccccc;
    margin: 0.5rem;
    padding: 0.5rem;
    overflow: hidden;
    text-overflow: ellipsis;

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
`;

export default function ContactCard(props) {
    const { contact } = props;
    const history = useHistory();

    return (
        <CardWrapper>
            <div id="head-wrapper">
                <div>img</div>
                <div>
                    <b>{contact.firstName}</b>, {contact.lastName}
                </div>
                <Button
                    label="View"
                    onClick={() => history.push(`/contacts/${contact.id}`)}
                />
            </div>

            <div id="communcate-wrapper" className="card-content">
                <div>{contact.email}</div>
                <div>{contact.phoneNumber}</div>
            </div>
        </CardWrapper>
    );
}

ContactCard.propTypes = {
    contact: PropTypes.object.isRequired,
}