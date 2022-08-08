import { toast } from 'react-toastify';
import React from 'react';
import PropTypes from 'prop-types';

toast.configure();

export default function ErrorNotification (props) {
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

ErrorNotification.propTypes = {
    message: PropTypes.string
};
