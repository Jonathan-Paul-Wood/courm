import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CommonModal from '../../../common/CommonModal';
import styled from 'styled-components';

const ValidationInfoContainer = styled.div`
`;

const ConfirmCheck = styled.div`
    .form-check-input {
        position: relative !important;
        margin: 0 0.25em 0 0 !important;
    }
`;

export default function UploadValidationModal (props) {
    const { showModal, setShowModal, onSubmit } = props;
    console.log('showModal: ', showModal);

    const [confirmChecked, setConfirmChecked] = useState(false);

    function handleSubmit () {
        onSubmit();
        setShowModal(false);
    }

    return (
        <CommonModal
            icon='info'
            title='Review Changes'
            onClose={() => setShowModal(false)}
            onSubmit={() => handleSubmit()}
            show={showModal}
        >
            <ValidationInfoContainer>
                <div>
                    You are about to do a bulk edit of your data.
                    Please ensure the following changes are correct.
                    Edits submitted beyond this point are final.
                </div>
                <ConfirmCheck>
                    <input
                        className='form-check-input'
                        type='checkbox'
                        id='confirm-upload-review'
                        checked={confirmChecked}
                        value={confirmChecked}
                        name='confirm-upload-review'
                        onChange={() => setConfirmChecked(!confirmChecked)}
                    />
                    <span>I have reviewed the above changes</span>
                </ConfirmCheck>
            </ValidationInfoContainer>
        </CommonModal>
    );
}

UploadValidationModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    setShowModal: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
};
