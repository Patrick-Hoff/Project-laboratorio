import './style.css';

import { Modal, Container } from "react-bootstrap";

function GenericModal({ show, onClose, title, size = "lg", children }) {
    return (
        <Container className='container-modal'>
            <Modal show={show} onHide={onClose} centered size={size}>
                {/* Header com título, pode ser substituído se quiser */}
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                {/* Corpo do modal — todo conteúdo passa via children */}
                <Modal.Body>
                    {children}
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default GenericModal;