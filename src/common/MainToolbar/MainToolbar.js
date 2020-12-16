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
                <Button 
                    label={`Sort`}
                    type="secondary"
                />
            </ControlContainer>
        </ContentWrapper>
    );
}