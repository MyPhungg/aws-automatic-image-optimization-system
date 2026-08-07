import "./AuthDivider.css";

interface AuthDividerProps {

    text?: string;

}

function AuthDivider({

    text = "OR"

}: AuthDividerProps) {

    return (

        <div className="auth-divider">

            <div className="line"></div>

            <span>

                {text}

            </span>

            <div className="line"></div>

        </div>

    );

}

export default AuthDivider;