import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token'); 

        if (!accessToken) {
            navigate('/login');
        }
    }, [navigate]);

    return children;
}

export default ProtectedRoute;
