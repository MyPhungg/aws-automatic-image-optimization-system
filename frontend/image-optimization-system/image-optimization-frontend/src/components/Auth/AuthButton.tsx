import "./AuthButton.css";

interface AuthButtonProps {

    text: string;

    loading?: boolean;

    type?: "button" | "submit";

    onClick?: () => void;

}

function AuthButton({

    text,

    loading = false,

    type = "button",

    onClick

}: AuthButtonProps) {

    return (

        <button

            className="auth-button"

            type={type}

            onClick={onClick}

            disabled={loading}

        >

            {

                loading

                ?

                "Loading..."

                :

                text

            }

        </button>

    );

}

export default AuthButton;