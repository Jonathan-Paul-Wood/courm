import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LoadingContainer = styled.div`
  position: absolute;
  z-index: 1000;
  top: 30vh;
  left: 50%;
  
  #spin-loader-group {
    display: block;
    .spinner, .multi-spinner {
      display: inline-block;
    }
  }

  /*second Group*/
  .spinner {
    margin: 0 auto;
    width: 60px;
    height: 60px;
    
    border: 3px solid #ddd;
    border-radius: 50%;
    animation: rotate linear 1s infinite;
    -webkit-animation: rotate linear 1s infinite;
    
    border-top-color: #4da6ff;
    border-right-color: #4da6ff;
  }

  .multi-spinner {
    width: 60px;
    height: 60px;
    
    &, div {       
      margin: 0 auto;    
      padding: 3px;
      border: 3px solid transparent;
      border-top-color: #ddd;
      border-radius: 50%;
      animation: rotate linear 2s infinite;
      -webkit-animation: rotate linear 2s infinite;
    }
    div {
      width: 100%;
      height: 100%;
    }
  }


  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @-webkit-keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes -rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
  @-webkit-keyframes -rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(-360deg); }
  }
`;

export default function LoadingSpinner(props) {
  const { type, styleGroup, size } = props;

  return (
    <LoadingContainer id="spin-loader-group">
        <div className={`${type} ${styleGroup} ${size}`}>
            <div>
                <div></div>
            </div>
        </div>
    </LoadingContainer>
  );
}

LoadingSpinner.defaultProps = {
    type: 'spinner',
    styleGroup: 'primary',
    size: 'lg'
}

LoadingSpinner.propTypes = {
    type: PropTypes.string,
    styleGroup: PropTypes.string,
    size: PropTypes.string,
}