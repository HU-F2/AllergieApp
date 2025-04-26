import { useEffect, useState } from 'react';

type AlertType = 'error' | 'notification' | 'success' | 'info';

interface Props {
    message: string;
    type: AlertType;
    autoRemoveTime?: number;
    onClose?: () => void;
}

const Alert = ({ message, type, autoRemoveTime, onClose }: Props) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (autoRemoveTime) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) {
                    onClose();
                }
            }, autoRemoveTime);

            return () => clearTimeout(timer);
        }
    }, [autoRemoveTime, onClose]);

    if (!visible) return null;

    const alertClass = `alert alert-${type}`;

    return (
        <div className={alertClass}>
            <span>{message}</span>
            {onClose && (
                <button
                    onClick={() => {
                        setVisible(false);
                        onClose?.();
                    }}
                    className="close-btn"
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default Alert;
