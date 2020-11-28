import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Input from '../../common/Input/Input';
import Button from '../../common/Button/Button';

const ContentWrapper = styled.div`

`;

const ControlContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-content: center;
    margin-bottom: 0.5em;
`;


export default function MainToolbar(props) {
    const history = useHistory();
    const [searchTerm, setSearchTerm] = useState('');

    function handleNavigation(path) {
        history.push(`/${path}`);
    }

    return (
        <ContentWrapper>
            <ControlContainer>
                <Button 
                    label={`Add ${props.type}`}
                />
                <Button 
                    label={`Export ${props.type}s`}
                />
            </ControlContainer>
            <ControlContainer>
                <Button 
                    label="Filter"
                />
                <Input
                    placeholder="Search"
                    label="Search"
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                />
                <Button 
                    label={`Sort`}
                />
            </ControlContainer>
        </ContentWrapper>
    );
}