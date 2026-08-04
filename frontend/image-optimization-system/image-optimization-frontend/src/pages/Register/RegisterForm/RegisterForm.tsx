import "./RegisterForm.css";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import AuthCard from "../../../components/Auth/AuthCard";
import AuthInput from "../../../components/Auth/AuthInput";
import AuthButton from "../../../components/Auth/AuthButton";
import AuthDivider from "../../../components/Auth/AuthDivider";

function RegisterForm() {

    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({

        fullName: "",

        email: "",

        password: "",

        confirmPassword: ""

    });

    function validate() {

        let valid = true;

        const newErrors = {

            fullName: "",

            email: "",

            password: "",

            confirmPassword: ""

        };

        if (!fullName.trim()) {

            newErrors.fullName = "Full name is required.";

            valid = false;

        }

        if (!email.trim()) {

            newErrors.email = "Email is required.";

            valid = false;

        }
        else {

            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!regex.test(email)) {

                newErrors.email = "Invalid email.";

                valid = false;

            }

        }

        if (!password) {

            newErrors.password = "Password is required.";

            valid = false;

        }
        else if (password.length < 8) {

            newErrors.password = "Minimum 8 characters.";

            valid = false;

        }

        if (!confirmPassword) {

            newErrors.confirmPassword = "Confirm your password.";

            valid = false;

        }
        else if (confirmPassword !== password) {

            newErrors.confirmPassword = "Passwords do not match.";

            valid = false;

        }

        setErrors(newErrors);

        return valid;

    }

    function handleRegister() {

        if (!validate()) return;

        setLoading(true);

        console.log({

            fullName,

            email,

            password

        });

        setTimeout(() => {

            setLoading(false);

            navigate("/login");

        }, 1200);

    }

    return (

        <AuthCard>

            <div className="register-header">

                <h1>

                    Create Account

                </h1>

                <p>

                    Create your account to save optimized images.

                </p>

            </div>

            <AuthInput

                label="Full Name"

                value={fullName}

                placeholder="John Doe"

                onChange={setFullName}

                error={errors.fullName}

            />

            <AuthInput

                label="Email"

                value={email}

                placeholder="example@email.com"

                onChange={setEmail}

                error={errors.email}

            />

            <AuthInput

                label="Password"

                type="password"

                value={password}

                placeholder="Minimum 8 characters"

                onChange={setPassword}

                error={errors.password}

            />

            <AuthInput

                label="Confirm Password"

                type="password"

                value={confirmPassword}

                placeholder="Re-enter password"

                onChange={setConfirmPassword}

                error={errors.confirmPassword}

            />

            <AuthButton

                text="Create Account"

                loading={loading}

                onClick={handleRegister}

            />

            <AuthDivider />

            <div className="register-bottom">

                <p>

                    Already have an account?

                </p>

                <Link to="/login">

                    Login

                </Link>

            </div>

        </AuthCard>

    );

}

export default RegisterForm;