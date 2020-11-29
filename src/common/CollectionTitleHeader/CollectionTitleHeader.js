import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button/Button';

const ContentWrapper = styled.div`
    border-bottom: solid 1px black;
    padding: 0 0 1em 0;
    margin-bottom: 1em;
    display: flex;
    justify-content: space-between;
`;

const RightSideContent = styled.div`
    margin-left: 60%;
`;

export default function CollectionTitleHeader(props) {
    const history = useHistory();
    const [listMode, setListMode] = useState(true);

    return (
        <ContentWrapper>
            <Button
                label="Back"
                type="secondary"
            />
            <h2>{props.title}</h2>
            <RightSideContent>
                {listMode ? (
                    <div classNames="switch">
                        <label>
                        List
                        <input type="checkbox" />
                        <span classNames="lever"></span> Map
                        </label>
                    </div>
                ) : (
                    <button>Edit</button>
                )}
            </RightSideContent>
        </ContentWrapper>
    );
}