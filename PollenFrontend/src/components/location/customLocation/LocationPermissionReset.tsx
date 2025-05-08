interface LocationPermissionResetProps {
    onClick: () => void;
}

const LocationPermissionReset = ({ onClick }: LocationPermissionResetProps) => {
    return (
        <div className="location-permission-reset-container">
            <button onClick={onClick}>Wijzig Locatie Toestemming</button>
        </div>
    );
};

export default LocationPermissionReset;