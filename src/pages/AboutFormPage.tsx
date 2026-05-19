// src/pages/AboutFormPage.tsx

import { useNavigate, useLocation } from "react-router-dom";
import AboutForm from "./AboutForm";

const AboutFormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // for edit case
    const editingAbout = location.state?.about || null;

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-3xl mx-auto px-4">

                <AboutForm
                    initialData={editingAbout}
                    onCancel={() => navigate(-1)}
                />

            </div>
        </div>
    );
};

export default AboutFormPage;