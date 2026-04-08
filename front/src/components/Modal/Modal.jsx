import './style.css';

import { Modal, Container } from "react-bootstrap";

function GenericModal({ show, onClose, title, size = "lg", children }) {
    return (
        <Container className='container-modal'>
            <Modal show={show} onHide={onClose} centered size={size}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {children}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default GenericModal;