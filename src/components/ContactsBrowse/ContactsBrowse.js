import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import CollectionTitleHeader from '../../common/CollectionTitleHeader/CollectionTitleHeader';
import MainToolbar from '../../common/MainToolbar/MainToolbar';

const ContentWrapper = styled.div`

`;

const ScrollContainer = styled.div`
    overflow-y: auto;
    height: 80vh;
    margin: 0 1em;
`;

const NoResultsMessage = styled.div`
    font-size: 1.2rem;
    font: italics;
`;

export default function ContactsBrowse(props) {
    const history = useHistory();
    const [activeFilters, setActiveFilters] = useState([]);

    function handleNavigation(path) {
        history.push(`/${path}`);
    }

    return (
        <ContentWrapper>
            <CollectionTitleHeader title="View Contacts" />
            <MainToolbar type="Contact" />
            <ScrollContainer>
                {props.contacts.length ? (
                    props.contacts.map(contact => {
                        return (
                            <div>
                                {contact}
                            </div>
                        )
                    })
                ) : (
                <NoResultsMessage className="warningMessage">Sorry, no results to display{activeFilters.length ? ' for your applied search filters' : ''}</NoResultsMessage>
                )}
            </ScrollContainer>
        </ContentWrapper>
    );
}