
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

function App() {

    const [idToken, setIdToken] = useState("");
    const [message, setMessage] = useState("");

    const handleSuccess = async (credentialResponse) => {

        const token = credentialResponse.credential;

        // Hiển thị ID Token
        setIdToken(token);

        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/google",
                {
                    idToken: token
                }
            );

            console.log(response.data);

            setMessage(" Đăng nhập thành công!");

        } catch (error) {

            console.error(error);

            setMessage(" Đăng nhập thất bại!");

        }

    };

    const copyToken = () => {

        navigator.clipboard.writeText(idToken);

        alert("Đã copy ID Token!");

    };

    return (

        <div
            style={{
                width: "80%",
                margin: "50px auto",
                textAlign: "center"
            }}
        >

            <h2>Google Login Demo</h2>

            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setMessage("Google Login Error")}
            />

            <br /><br />

            <h3>{message}</h3>

            {idToken && (
                <>
                    <h3>Google ID Token</h3>

                    <textarea
                        rows="12"
                        cols="100"
                        value={idToken}
                        readOnly
                    />

                    <br /><br />

                    <button onClick={copyToken}>
                        Copy ID Token
                    </button>
                </>
            )}

        </div>

    );

}

export default App;