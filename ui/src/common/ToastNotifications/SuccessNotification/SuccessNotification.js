import { toast } from 'react-toastify';
import React from 'react';
import PropTypes from 'prop-types';

toast.configure();

export default function SuccessNotification (props) {
    const {
        message
    } = props;

    return (
        <span>{
            toast.success(message, {
                position: toast.POSITION.TOP_CENTER
            })
        }</span>
    );
}

SuccessNotification.propTypes = {
    message: PropTypes.string
};
