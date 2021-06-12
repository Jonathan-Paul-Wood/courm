import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LoadingContainer = styled.span`
transform: rotate(-90deg);
display: inline-block;
      div {
        margin: 0 auto;
        width: 0.75em;
        height: 0.75em;
        background: #ddd;
        border-radius: 50%;
        animation: bounce linear 1.2s infinite;
        -webkit-animation: bounce linear 1.2s infinite;
      }
        
      div:nth-child(2) {
        animation-delay: .5s;
        -webkit-animation-delay: .5s
      }
  
      div:nth-child(3) {
        animation-delay: .8s;
        -webkit-animation-delay: .8s;
      }

      @keyframes bounce {
        0%, 80%, 100% { transform: scale(1); }
        40% { transform: scale(0); }
      }
      
      @-webkit-keyframes bounce {
        0%, 80%, 100% { transform: scale(1); }
        40% { transform: scale(0); }
      }
`;

export default function LoadingLoop(props) {
  const { type, styleGroup, size } = props;

  return (
    <LoadingContainer>
      <div className={`bubbles ${styleGroup} ${size}`}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </LoadingContainer>
  );
}

LoadingLoop.defaultProps = {
    styleGroup: 'primary',
    size: 'lg'
}

LoadingLoop.propTypes = {
    styleGroup: PropTypes.string,
    size: PropTypes.string,
}