import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';
import Tooltip from '../Tooltip/Tooltip';

const ContentWrapper = styled.div`

`;

const ControlContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin-bottom: 0.5em;
    .input-field {
        padding: 0 3em;
    }
`;

const PopoverContainer = styled.div`
    background-color: #ffffff;
    width: 20vw;
    min-width: 275px;
    height: 30vh;
    min-height: 150px;
    border: solid black 1px;
    border-radius: 4px;

    overflow-y: auto;
    overflow-x: hidden;

    #popover-header {
        border-bottom: solid black 1px;
        height: 1.25em;
        font-size: 1.25em;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin: 0 2.5%;
        justify-content: right;
    }

`;

const RadioList = styled.div`
    .section-header {
        font-size: 14px;
    }
    
    .highlight {
        background: #4D98EF;
        border-radius: 50%;
        height: 12px;
        left: 14px;
        pointer-events: none;
        position: absolute;
        top: 14px;
        transition: transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.2);
        transform: translateY(-50px);
        width: 12px;
    }
`;

const RadioEntry = styled.div`
    display: block;
    width: 100%;
    height: 1em;
    margin: 0.25em 0 0.75em 0;
    position: relative;
    
    .entry {
        height: 2em;
        position: absolute;
        width: 100%;
    }
    .entry:nth-child(2) {
        left: 8px;
        top: 8px;
    }
    .entry:nth-child(4) {
        left: 8px;
        top: 58px;
    }
    .entry:nth-child(6) {
        left: 8px;
        top: 108px;
    }
    .circle {
        border: 2px solid #545556;
        border-radius: 50%;
        cursor: pointer;
        height: 1.1em;
        position: absolute;
        transition: border-color 300ms;
        width: 1.1em;
    }
    .entry-label {
        cursor: pointer;
        padding-left: 2em;
        user-select: none;
        -moz-user-select: none;
    }
    .hidden {
        display: none;
    }
    .hidden:nth-child(1):checked ~ .highlight {
        transform: translateY(0);
    }
    .hidden:nth-child(3):checked ~ .highlight {
        transform: translateY(50px);
    }
    .hidden:nth-child(5):checked ~ .highlight {
        transform: translateY(100px);
    }
    .hidden:nth-child(1):checked + .entry .circle {
        border-color: #4D98EF;
    }
    .hidden:nth-child(3):checked + .entry .circle {
        border-color: #4D98EF;
    }
    .hidden:nth-child(5):checked + .entry .circle {
        border-color: #4D98EF;
    }
`;


export default function MainToolbar(props) {
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState('');

    function handleNavigation(path) {
        history.push(`/${path}`);
    }

    const contactSortOptions = [
        {
            label: 'First Name',
            value: 'firstName'
        },
        {
            label: 'Last Name',
            value: 'lastName'
        },
        {
            label: 'Date Of Birth',
            value: 'dob'
        },
        {
            label: 'Date Created',
            value: 'createdOn'
        },
        {
            label: 'Date of Last Change',
            value: 'lastModifiedOn'
        },
        {
            label: 'Recently Interacted',
            value: 'lastInteractedOn'
        },
    ]

    return (
        <ContentWrapper>
            <ControlContainer>
                <Button
                    icon="plusCircle"
                    label={`Add ${props.type}`}
                    onClick={() => history.push('/contacts/new')}
                />
                <Button 
                    label={`Export ${props.type}s`}
                />
            </ControlContainer>
            <ControlContainer>
                <Button 
                    label="Filter"
                    type="secondary"
                />
                <Input
                    placeholder="Search"
                    label="Search"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                />
                <Tooltip
                    content={
                        <PopoverContainer>
                            <div id="popover-header" label="Select Sort Field & Direction">
                                Select Sort Field & Direction
                            </div>
                            <RadioList>
                                {contactSortOptions.map((option, index) => {
                                    return (
                                        <RadioEntry key={index}>
                                            <input type="radio" class="hidden" id={index} name="inputs" />
                                            <label class="entry" for={index}>
                                                <div class="circle"></div>
                                                <div class="entry-label">{option.label}</div>
                                            </label>
                                        </RadioEntry>
                                    )
                                })}
                                <div class="highlight"></div>
                            </RadioList>
                        </PopoverContainer>
                    }
                    style={{
                        'margin': 'auto 0',
                    }}
                >
                    <Button 
                        label={`Sort`}
                        type="secondary"
                    />
                </Tooltip>
            </ControlContainer>
        </ContentWrapper>
    );
}