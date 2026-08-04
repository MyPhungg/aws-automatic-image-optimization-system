import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type { User } from "../types/User";

interface AuthContextType {

    user: User | null;

    isAuthenticated: boolean;

    login: (user: User) => void;

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

    function login(userData: User) {

        setUser(userData);

    }

    function logout() {

        setUser(null);

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
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