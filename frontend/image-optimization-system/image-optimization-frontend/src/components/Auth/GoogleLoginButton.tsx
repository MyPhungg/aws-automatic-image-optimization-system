import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";

function GoogleLoginButton() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSuccess = async (credentialResponse: any) => {

        try {

            const result = await authService.googleLogin(
                credentialResponse.credential!
            );

            login(
                result.token ?? "",
                {
                    userId: result.userId,
                    name: result.name,
                    email: result.email,
                    avatarUrl: result.avatarUrl
                }
            );

            navigate("/dashboard");

        }
        catch (error) {

            console.error(error);

        }

    };

    return (

        <GoogleLogin

            onSuccess={handleSuccess}

            onError={() => {

                console.log("Google Login Failed");

            }}

        />

    );

}

export default GoogleLoginButton;