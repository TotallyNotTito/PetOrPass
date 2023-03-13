import {Navigate} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (<></>);
    } else if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
