import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

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

    .details-row {
        display: flex;
        justify-content: space-between;
        margin: 0.5em;
    }
`;

export default function NoteCard (props) {
    const { note } = props;
    const history = useHistory();

    return (
        <CardWrapper className="a-cursor-pointer" onClick={() => history.push(`/notes/${note.id}`)}>
            <div className="details-row">
                <h3>{note.title}</h3>
                <span>Created: {new Date(note.createdOn).getDate()}</span>
            </div>
            <div className="details-row">
                <h3>{new Date(note.date).getDate()}</h3>
                <span>Created: {new Date(note.lastModifiedOn).getDate()}</span>
            </div>
        </CardWrapper>
    );
}

NoteCard.propTypes = {
    note: PropTypes.object.isRequired
};
