import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Button from '../Button/Button';

const ContentWrapper = styled.div`
    border-bottom: solid 1px black;
    padding: 0 0 1em 0;
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
        margin: auto auto;
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
    const {title, handleSave, editMode, toggleEdit, disableSave} = props;
    const history = useHistory();
//TODO: toggleEdit: should back just switch the bool if we are editing a contact? Ya, that way default is navigate back (away from new), but can also just toggle out of edit (of existing)
    return (
        <ContentWrapper>
            <Button
                className="back"
                label="Back"
                type="secondary"
                onClick={history.goBack} //Need some way to distinguish new from editing
            />
            <h2 className="pageTitle">{title}</h2>
            <RightSideContent className="save-edit">
                {editMode ? (
                    <Button
                        label="Save"
                        type="success"
                        icon="saveIcon"
                        onClick={handleSave}
                        disabled={disableSave}
                    />
                ) : (
                    <Button label="Edit" type="secondary" />
                )}
            </RightSideContent>
        </ContentWrapper>
    );
}

EntityTitleHeader.propTypes = {
    title: PropTypes.string.isRequired,
    editMode: PropTypes.bool.isRequired,
    toggleEdit: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    disableSave: PropTypes.bool.isRequired,
}