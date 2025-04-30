import './Modal.css';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    closeOnOverlayClick?: boolean;
};

const Modal = ({
    isOpen,
    onClose,
    children,
    closeOnOverlayClick = true,
}: Props) => {
    if (!isOpen) return null;

    const handleOverlayClick = () => {
        if (closeOnOverlayClick) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
