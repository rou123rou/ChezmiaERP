import { useContext } from 'react';
import AuthContext, { AuthContextType } from '../contexts/AuthContext';

const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};

export default useAuth;