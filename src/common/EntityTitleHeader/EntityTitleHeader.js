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
    grid-template-columns: 15% 65% 20%;
    grid-template-areas: "back title save-edit";

    .back {
        grid-area: back;
    }
    .pageTitle {
        grid-area: title;
        margin: 0 auto;
    }
    .save-edit {
        grid-area: save-edit;
    }
`;

const RightSideContent = styled.div`
    display: flex;
    justify-content: space-between;
`;

export default function EntityTitleHeader(props) {
    const history = useHistory();

    return (
        <ContentWrapper>
            <Button classNames="back" label="Back" type="secondary" onClick={history.goBack} />
            <h2 classNames="pageTitle">{props.title}</h2>
            <RightSideContent classNames="save-edit">
                {props.editMode ? (
                    <React.Fragment>
                        <Button
                            label="Cancel"
                            type="secondary"
                            onClick={() => history.goBack()}
                        />
                        <Button label="Save" type="success" icon="saveIcon" />
                    </React.Fragment>
                ) : (
                    <Button label="Edit" type="secondary" />
                )}
            </RightSideContent>
        </ContentWrapper>
    );
}

EntityTitleHeader.propTypes = {
    editMode: PropTypes.bool.isRequired,
    toggleEdit: PropTypes.func.isRequired,
}