import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Button from '../Button';

const ContentWrapper = styled.div`
    position: fixed;
    top: 4em; //tied to height of header bar
    height: 4em;
    width: calc(100% - 10em);
    background-color: #ffffff;
    z-index: 700;
    padding: 0 1em;

    border-bottom: solid 1px black;
    margin-bottom: 1em;
    display: flex;
    justify-content: space-between;
    display: grid;
    gird-template-rows: 100%;
    grid-template-columns: 15% 70% 15%;
    grid-template-areas: "back title save-edit";

    .back {
        grid-area: back;
    }
    .pageTitle {
        grid-area: title;
        width: 100%;
        white-space: nowrap;
        margin: auto auto;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: default;
        text-align: center;
    }
    .save-edit {
        grid-area: save-edit;
    }
`;

const RightSideContent = styled.div`
    display: flex;
    justify-content: right;
`;

export default function EntityTitleHeader(props) {
    const {title, handleSave, editMode, disableSave} = props;
    const { contactId } = useParams();
    const history = useHistory();

    return (
        <ContentWrapper>
            <Button
                className="back"
                label={'BACK'}
                type="secondary"
                onClick={history.goBack}
            />
            <h2 className="pageTitle" title={title}>{title}</h2>
            <RightSideContent className="save-edit">
                {editMode ? (
                    <Button
                        label="SAVE"
                        type="success"
                        icon="saveIcon"
                        onClick={handleSave}
                        disabled={disableSave}
                    />
                ) : (
                    <Button
                        label="EDIT"
                        type="secondary" 
                        onClick={() => history.push(`/contacts/${contactId}/edit`)}
                    />
                )}
            </RightSideContent>
        </ContentWrapper>
    );
}

EntityTitleHeader.defaultProps = {
    handleSave: () => {},
    disableSave: true,
}

EntityTitleHeader.propTypes = {
    title: PropTypes.string.isRequired,
    handleSave: PropTypes.func,
    disableSave: PropTypes.bool,
    editMode: PropTypes.bool.isRequired,
}