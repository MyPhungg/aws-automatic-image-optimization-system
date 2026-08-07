import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { User } from "../types/User";

interface AuthContextType {

    user: User | null;

    isAuthenticated: boolean;

    login: (
        token: string,
        user: User
    ) => void;

    logout: () => void;

}

const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {

    children: ReactNode;

}

export function AuthProvider({

    children,

}: AuthProviderProps) {

    const [user, setUser] = useState<User | null>(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Khôi phục phiên đăng nhập khi F5
    useEffect(() => {

        const token = localStorage.getItem("token");

        const userData = localStorage.getItem("user");

        if (token && userData) {

            setUser(JSON.parse(userData));

            setIsAuthenticated(true);

        }

    }, []);

    // Login
    const login = (

        token: string,

        user: User

    ) => {

        localStorage.setItem(

            "token",

            token

        );

        localStorage.setItem(

            "user",

            JSON.stringify(user)

        );

        setUser(user);

        setIsAuthenticated(true);

    };

    // Logout
    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

        setIsAuthenticated(false);

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                isAuthenticated,

                login,

                logout,

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(

            "useAuth must be used inside AuthProvider"

        );

    }

    return context;

}