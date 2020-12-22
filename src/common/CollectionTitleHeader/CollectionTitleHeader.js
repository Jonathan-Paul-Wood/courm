import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../Button/Button';

const ContentWrapper = styled.div`
    position: fixed;
    top: 4em; //tied to height of header bar
    height: 4em;
    width: calc(100% - 10em);
    background-color: #ffffff;
    z-index: 700;
    padding: 0 1em;
    margin: 0 0 1em 0;

    border-bottom: solid 1px black;
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
                onClick={history.goBack}
            />
            <h2>{props.title}</h2>
            <RightSideContent>
                {listMode ? (
                    <div className="switch">
                        <label>
                        List
                        <input type="checkbox" />
                        <span className="lever"></span> Map
                        </label>
                    </div>
                ) : (
                    <button>Edit</button>
                )}
            </RightSideContent>
        </ContentWrapper>
    );
}