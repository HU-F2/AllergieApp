import { useEffect, useState } from 'react';
import { LocationPermissionType } from '../../../contexts/LocationContext';
import Modal from '../../common/modal/Modal';
import './LocationPermissionModal.css';

type Props = {
    permission: LocationPermissionType;
    onAccept: () => void;
    onDeny: () => void;
};

const LocationPermissionModal = ({ permission, onAccept, onDeny }: Props) => {
    const [isOpen, setIsOpen] = useState(permission == null);

    useEffect(() => {
        setIsOpen(permission == null);
    }, [permission]);

    const handleAccept = () => {
        setIsOpen(false);
        onAccept();
    };

    const handleDeny = () => {
        setIsOpen(false);
        onDeny();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            closeOnOverlayClick={false}
        >
            <div className="locationPermission">
                <h2>Locatie Toestemming</h2>
                <p>
                    We hebben uw toestemming nodig om toegang te krijgen tot uw
                    locatiegegevens.
                </p>
                <div className="locationPermission--actions">
                    <button className="button deny-btn" onClick={handleDeny}>
                        Weigeren
                    </button>
                    <button
                        className="button accept-btn"
                        onClick={handleAccept}
                    >
                        Toestaan
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default LocationPermissionModal;
