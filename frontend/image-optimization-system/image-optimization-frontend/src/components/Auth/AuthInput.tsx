import "./AuthInput.css";

interface AuthInputProps {

    label: string;

    type?: string;

    value: string;

    placeholder?: string;

    error?: string;

    onChange: (value: string) => void;

}

function AuthInput({

    label,

    type = "text",

    value,

    placeholder,

    error,

    onChange

}: AuthInputProps) {

    return (

        <div className="auth-input">

            <label>

                {label}

            </label>

            <input

                type={type}

                value={value}

                placeholder={placeholder}

                onChange={(e) =>

                    onChange(e.target.value)

                }

            />

            {

                error &&

                <span className="input-error">

                    {error}

                </span>

            }

        </div>

    );

}

export default AuthInput;