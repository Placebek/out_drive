import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRouteDriver({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        const role = localStorage.getItem('original_roles')

        if (!access_token ) {
            navigate('/login');
        }
        else if (role === 'driver') {
            navigate('/')
        }
    }, [navigate]);

    return children;
}

export default ProtectedRouteDriver;
