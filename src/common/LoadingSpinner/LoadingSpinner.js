import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const LoadingContainer = styled.span`
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    @spinner_radius: 90%;
    @spinner_fill_radius: 90px;
    @spinner_speed: .675s;
    
    .spinner, .multi-spinner, .bubbles {
      display: inline-block;
    }

    //type
    .spinner {
      position: relative;
      margin: 0 auto;
      border-radius: @spinner_radius;
      width: @spinner_size;
      height: @spinner_size;
      animation: spin @spinner_speed linear 0 infinite normal;
      -webkit-animation: spin @spinner_speed linear 0 infinite normal;
      -moz-animation: spin @spinner_speed linear 0 infinite normal;
      background: @spinner_bg;  
      
      &:before,
      &:after {
        content: "";
        display: block;
        position: absolute;
      }
      
       &:before {    
        background: linear-gradient(@spinner_bg, @spinner_color);      
        border-radius: 0 @spinner_fill_radius @spinner_fill_radius 0;
        height: @spinner_size;
        width: 50%;
        top: 0;
        right: 0;
        z-index: 1;    
      }
      
      &:after {
        border-radius: @spinner_radius;
        height: @spinner_inner_circle;
        width: @spinner_inner_circle;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: @spinner_inner_bg;
        z-index: 1;
      } 
    }
    .multi-spinner {

    }

    //orientation

    //styleGroup
    .primary {
      @spinner_color: #6a9a1f;
      @spinner_bg: #cdc;
      @spinner_inner_bg: #FFFFFF;
    }
    .secondary {

    }

    //size
    .sm {
      @spinner_size_sm: 30px;
      @spinner_thickness_sm: 7px;
      @spinner_inner_circle_sm: @spinner_size_sm - @spinner_thickness_sm;
    }
    .md {
      @spinner_size: 50px;
      @spinner_thickness: 10px;
      @spinner_inner_circle: @spinner_size - @spinner_thickness;
    }
    .lg {
      @spinner_size_lg: 100px;
      @spinner_thickness_lg: 15px;
      @spinner_inner_circle_lg: @spinner_size_lg - @spinner_thickness_lg;
    }
`;

export default function LoadingSpinner(props) {
  const { type, styleGroup, size } = props;

  return (
    <LoadingContainer>
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