import "./AuthCard.css";
import type { ReactNode } from "react";

interface AuthCardProps {

    children: ReactNode;

}

function AuthCard({

    children

}: AuthCardProps) {

    return (

        <div className="auth-card">

            {children}

        </div>

    );

}

export default AuthCard;