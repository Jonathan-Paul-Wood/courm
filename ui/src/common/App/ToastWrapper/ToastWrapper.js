import React from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import styled from 'styled-components';
import { SUCCESS, ERROR, WARNING, LIGHT_GREY } from '../../../assets/colorsConstants';

const ToastWrapperContainer = styled(ToastContainer)`
    position: absolute;
    top: 1em;
    right: 1em;

    .Toastify__toast--success {
        background-color: ${SUCCESS};
    }
    .Toastify__toast--error {
        background-color: ${ERROR};
    }
    .Toastify__toast--warning {
        background-color: ${WARNING};
    }

    .Toastify__toast {
        display: flex;
        border-radius: 0.5em;
        width: 15em;
        min-height: 3em;
        box-shadow: 0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05);

        transform: translateX(0px);
        opacity: 1;
        transition: transform 0.2s ease 0s, opacity 0.2s ease 0s;

        .Toastify__toast-body {
            display: flex;
            flex: 7;
            margin-left: 1em;
            background-color: ${LIGHT_GREY};
        }
        .Toastify__close-button {
            display: flex;
            flex: 1;
            background: transparent;
            outline: none;
            border: none;
        }
    }
`;

export default function ToastWrapper () {
    return (
        <ToastWrapperContainer
            hideProgressBar={true}
            position={toast.POSITION.TOP_RIGHT}
            transition={Slide}
            autoClose={0}
        />
    );
};
