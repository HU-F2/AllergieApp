import EducationTips from '../components/EducationTips.js';
import Navbar from '../components/Navbar.js';

const EducationPage = () => {
    return (
        <div className="education-container">
            <Navbar />
            <h1>Hooikoorts Educatie en Tips</h1>
            <EducationTips />
        </div>
    );
};

export default EducationPage;