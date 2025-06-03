import React from 'react';
import Modal from './common/modal/Modal';

interface LocationPermissionNoticeProps {
    isOpen: boolean;
    onClose: () => void;
    closeOnOverlayClick?: boolean;
    customCloseHandler?: () => void;
}

const LocationPermissionNotice: React.FC<LocationPermissionNoticeProps> = ({
    isOpen,
    onClose,
    closeOnOverlayClick = true,
    customCloseHandler,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={closeOnOverlayClick}
        >
            <div className="location-permission-content">
                <h2>Locatietoestemming vereist</h2>
                <p>
                    Om deze functionaliteit te gebruiken, moet u eerst locatietoestemming geven
                    of een locatie kiezen op de home pagina.
                </p>
                <div className="modal-buttons">
                    <button
                        className="close-button primary"
                        onClick={customCloseHandler || onClose}
                    >
                        Begrepen
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LocationPermissionNotice;