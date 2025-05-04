import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/Auth/Auth';
import PermissionDenied from '../../components/Placeholders/PermissionDenied';

const PrivateRoute = ({ children, roles, fallback = null }) => {
    const { auth, role, has_signed_policies, } = useAuth();

    // Si no está autenticado, redirige a login
    if (!auth) return <Navigate to="/login" />;

    if (!roles.includes(role)) return <PermissionDenied />;

    if (!has_signed_policies) return <Navigate to="/politicas-empresa" />;

    // Si está autenticado, retorna los children o un fallback si se pasa como prop
    return children || fallback;
};

export default PrivateRoute;
