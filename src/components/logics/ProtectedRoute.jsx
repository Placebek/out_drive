import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const access_token = localStorage.getItem('access_token'); 

        if (!access_token) {
            navigate('/login');
        }
    }, [navigate]);

    return children;
}

export default ProtectedRoute;
