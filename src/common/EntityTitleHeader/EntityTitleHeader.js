import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const ContentWrapper = styled.div`
    border-bottom: solid 1px black;
    padding: 0 1em;
    margin-bottom: 1em;
`;

const RightSideContent = styled.div`
    margin-left: 60%;
`;

export default function EntityTitleHeader(props) {
    const history = useHistory();
    const [editMode, setEditMode] = useState(false);

    return (
        <ContentWrapper>
            <button onClick={() => history.goBack}>Back</button>
            <h2>{props.title}</h2>
            <RightSideContent>
                {editMode ? (
                    <React.Fragment>
                        <button>Cancel</button>
                        <button>Save</button>
                    </React.Fragment>
                ) : (
                    <button>Edit</button>
                )}
            </RightSideContent>
        </ContentWrapper>
    );
}