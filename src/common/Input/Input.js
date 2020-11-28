import React from 'react';
import styled from 'styled-components';


const StyleContainer = styled.div`
    input[type=text]:focus:not([readonly]) {
        border: 1px solid #4dd0e1;
        box-shadow: 0 0 0 1px #4dd0e1;
    }
`;


export default function Input(props) {
    return (
        <StyleContainer>
            <input type="text" placeholder={props.placeholder} onChange={props.onChange} />
            <span><i class="fas fa-search" aria-hidden="true"></i></span>
        </StyleContainer>
    );
}