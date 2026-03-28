import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const AccordionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const Section = styled.div`
    border: 1px solid #d9d9d9;
    border-radius: 0.25rem;
    overflow: hidden;
`;

const HeaderButton = styled.button`
    width: 100%;
    padding: 0.75rem 1rem;
    border: 0;
    background: #f7f7f7;
    font-weight: 600;
    text-align: left;
`;

const Body = styled.div`
    padding: 1rem;
    background: #ffffff;
`;

export default function Accordion ({ sections }) {
    const [openSection, setOpenSection] = useState(null);

    return (
        <AccordionContainer>
            {sections.map((section, index) => {
                const isOpen = openSection === index;

                return (
                    <Section key={section.title || index}>
                        <HeaderButton
                            type="button"
                            onClick={() => setOpenSection(isOpen ? null : index)}
                        >
                            {section.title || `Section ${index + 1}`}
                        </HeaderButton>
                        {isOpen && <Body>{section.content}</Body>}
                    </Section>
                );
            })}
        </AccordionContainer>
    );
}

Accordion.propTypes = {
    sections: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string,
        content: PropTypes.node
    })).isRequired
};
