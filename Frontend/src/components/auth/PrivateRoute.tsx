import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext'; // Importation correcte de useAuthContext

interface PrivateRouteProps {
    children?: React.ReactNode; // Pour les anciennes versions de React Router
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuthContext(); // Utilisation de useAuthContext
    const location = useLocation();

    if (!isAuthenticated) {
        // Rediriger l'utilisateur vers la page de connexion, en conservant l'URL où il voulait aller
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si l'utilisateur est authentifié, afficher l'enfant (la route protégée)
    return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;