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

    .pageTitle {
        margin: auto 0;
        padding: 0 auto;
    }
`;

const RightSideContent = styled.div`
    margin-left: 60%;
`;

export default function EntityTitleHeader(props) {
    const history = useHistory();

    return (
        <ContentWrapper>
            <Button label="Back" type="secondary" onClick={() => history.back()} />
            <h2 className="pageTitle">{props.title}</h2>
            <RightSideContent>
                {props.editMode ? (
                    <React.Fragment>
                        <Button label="Cancel" type="secondary" />
                        <Button label="Save" type="success" />
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