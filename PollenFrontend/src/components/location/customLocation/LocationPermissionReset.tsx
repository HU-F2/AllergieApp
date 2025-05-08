interface LocationPermissionResetProps {
    onClick: () => void;
}

const LocationPermissionReset = ({ onClick }: LocationPermissionResetProps) => {
    return (
        <div className="location-permission-reset-container">
            <button onClick={onClick}>Wijzig locatie toestemming</button>
        </div>
    );
};

export default LocationPermissionReset;