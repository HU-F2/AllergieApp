import EducationTips from '../components/EducationTips.js';
import Navbar from '../components/common/navigation/Navbar.js';

const EducationPage = () => {
    return (
        <>
            <Navbar />
            <div className="education-container">
                <h1>Hooikoorts Educatie en Tips</h1>
                <EducationTips />
            </div>
        </>
    );
};

export default EducationPage;
