import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DriverSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const [role, setRole] = useState(null);
    const [originalRole, setOriginalRole] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRoleChange = () => {
        if (originalRole === 'driver') {
            const newRole = role === 'driver' ? 'passenger' : 'driver';
            setRole(newRole);
            localStorage.setItem('roles', newRole);
            navigate('/');

            setTimeout(() => {
                setLoading(false);  // Убрать лоадер после "загрузки"
            }, 500);  // Имитация времени для обновления
        }
    };

    useEffect(() => {
        const originalRoleFromStorage = localStorage.getItem('original_roles');
        const storedRole = localStorage.getItem('roles') || 'passenger';

        setOriginalRole(originalRoleFromStorage);
        setRole(storedRole);
    }, []);

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-30 z-50">
                <div className="spinner-border text-white" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className={`fixed top-0 left-0 h-full w-[70vw] bg-gradient-to-l from-lime-600 to-lime-500 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold font-notosans">Menu</h2>
                    <button
                        className="text-gray-500 text-xl"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>

                <div className="flex justify-between items-center p-4">
                    <span className="text-lg font-semibold text-white">
                        Switch to {role === 'driver' ? 'Passenger' : 'Driver'}
                    </span>
                    <div
                        className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in"
                    >
                        <span
                            onClick={handleRoleChange}
                            className={`block w-14 h-8 rounded-full cursor-pointer ${role === 'driver' ? 'bg-green-500' : 'bg-gray-400'}`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 block w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${role === 'driver' ? 'translate-x-6' : 'translate-x-0'}`}
                            ></span>
                        </span>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className={`absolute ml-[70vw] w-[30vw] h-full inset-0 bg-black bg-opacity-30 z-10 duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={onClose}
                ></div>
            )}
        </>
    );
};

export default DriverSidebar;
