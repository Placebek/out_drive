import React, { createContext, useState, useContext, useEffect } from 'react';

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
    const [role, setRole] = useState(localStorage.getItem('roles') || 'passenger');
    const [originalRole, setOriginalRole] = useState(localStorage.getItem('original_roles') || 'passenger');

    const handleRoleChange = () => {
        if (originalRole === 'driver') {
            const newRole = role === 'driver' ? 'passenger' : 'driver';
            setRole(newRole);
            localStorage.setItem('roles', newRole);
        }
    };

    useEffect(() => {
        setRole(localStorage.getItem('roles') || 'passenger');
    }, []);

    return (
        <RoleContext.Provider value={{ role, handleRoleChange }}>
            {children}
        </RoleContext.Provider>
    );
};
