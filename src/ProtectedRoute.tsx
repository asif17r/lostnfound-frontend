import { useContext, useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const context = useContext(AuthContext);
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            if (!context?.token || !context?.isTokenValid) {
                setIsValid(false);
                return;
            }

            try {
                const valid = await context.isTokenValid();
                setIsValid(valid);
            } catch (error) {
                console.error('Error checking token validity:', error);
                setIsValid(false);
            }
        };
        checkAuth();
    }, [context]);

    if (isValid === null) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    return isValid ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
