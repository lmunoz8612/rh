import React, { createContext, useContext } from 'react';
import { ROLES } from '../../assets/constants/constants';
import api from '../../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getSessionValue = (key, defaultValue) => {
        try {
            return JSON.parse(localStorage.getItem(key)) ?? defaultValue;
        }
        catch {
            return defaultValue;
        }
    };

    const [loading, setLoading] = React.useState(true);
    const [auth, setAuth] = React.useState(getSessionValue('auth', false));
    const [role, setRole] = React.useState(getSessionValue('role', ROLES.COLABORATOR)); // Por omisión, rol de colaborador.
    const [hasSignedPolicies, setHasSignedPolicies] = React.useState(getSessionValue('has_signed_policies', 0)); // Por omisión, sin firmar.

    const login = React.useCallback(async (role, has_signed_policies) => {
        // Set authentication Login
        setAuth(true);
        setRole(role);
        setHasSignedPolicies(has_signed_policies);
        localStorage.setItem('auth', true);
        localStorage.setItem('role', role);
        localStorage.setItem('has_signed_policies', has_signed_policies);
    }, []);

    const logout = React.useCallback(() => {
        // Remove authentication.
        setAuth(false);
        localStorage.removeItem('auth');
        localStorage.removeItem('role');
        localStorage.removeItem('has_signed_policies');
    }, []);

    React.useEffect(() => {
        const fetchData = async () => {
            if (!auth) {
                setLoading(false);
                return;
            }

            try {
                const responseRole = await api.get('role');
                if (responseRole.ok) {
                    setRole(responseRole.role);
                    localStorage.setItem('role', responseRole.role);
                }

                const responseSignedPolicies = await api.get('user/has_signed_policies');
                if (responseSignedPolicies.ok) {
                    setHasSignedPolicies(responseSignedPolicies.has_signed_policies);
                    localStorage.setItem('has_signed_policies', responseSignedPolicies.has_signed_policies);
                }
            }
            catch (error) {
                console.error(`Error al obtener la información: ${error}`);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [auth]);

    const value = React.useMemo(() => ({
        auth: Boolean(auth),
        role: Number(role),
        has_signed_policies: Number(hasSignedPolicies),
        login,
        logout
    }), [auth, role, hasSignedPolicies, login, logout]);

    if (loading) return null;

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);