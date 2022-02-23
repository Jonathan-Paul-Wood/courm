import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import icons from '../../assets/icons/bootstrapIcons';
import Modal from 'react-bootstrap/Modal';
import Button from '../Button';

const IconContainer = styled.span`
    margin-right: 0.5rem;
`;

const ModalContainer = styled(Modal)`
    Button {
        margin: 0 0.5rem;
    }
`;

export default function CommonModal (props) {
    const { icon, title, onClose, onSubmit, isSubmitVisible, isCancelVisible, isCloseVisible, submitText, children, show } = props;

    return (
        <ModalContainer show={show} onHide={onClose} centered scrollable>
            <Modal.Header closeButton={isCloseVisible}>
                <Modal.Title>
                    <IconContainer>
                        {icons[icon]}
                    </IconContainer>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {(isSubmitVisible || isCancelVisible) && (
                <Modal.Footer>
                    {isCancelVisible &&
                    <Button label='Cancel' type="secondary" onClick={onClose} />
                    }
                    {isSubmitVisible &&
                    <Button label={submitText} type="success" onClick={onSubmit} />
                    }
                </Modal.Footer>
            )}
        </ModalContainer>
    );
}

CommonModal.defaultProps = {
    onSubmit: () => {},
    isSubmitVisible: true,
    isCancelVisible: true,
    isCloseVisible: true,
    submitText: 'Submit'
};

CommonModal.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func,
    isSubmitVisible: PropTypes.bool,
    isCancelVisible: PropTypes.bool,
    isCloseVisible: PropTypes.bool,
    submitText: PropTypes.string,
    children: PropTypes.object.isRequired,
    show: PropTypes.bool.isRequired
};
