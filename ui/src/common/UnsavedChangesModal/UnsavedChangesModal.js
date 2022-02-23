import React from 'react';
import PropTypes from 'prop-types';
import CommonModal from '../CommonModal';

export default function UnsavedChangesModal (props) {
    const { onClose, onSubmit, show } = props;

    return (
        <CommonModal
            icon="warning"
            title="Unsaved Changes"
            onClose={onClose}
            onSubmit={onSubmit}
            submitText="Confirm"
            show={show}
        >
            {'If you do not first save your changes they will be lost. Are you certain you wish to leave this page?'}
        </CommonModal>
    );
}

UnsavedChangesModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired
};
