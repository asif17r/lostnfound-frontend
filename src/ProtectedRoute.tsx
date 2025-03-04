import { useContext, useEffect, useState, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { token, isTokenValid } = useContext(AuthContext) || {};
    const [isValid, setIsValid] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            if (isTokenValid) {
                const valid = await isTokenValid();
                setIsValid(valid);
            }
        };
        checkAuth();
    }, [token, isTokenValid]);

    if (isValid === null) return <div>Loading...</div>;

    return isValid ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
