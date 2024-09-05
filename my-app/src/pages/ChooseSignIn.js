import React from "react";
import { useNavigate } from "react-router-dom";

export default function ChooseSignIn() {

    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    }

    return (
        <div className="home">
            <h1>Welcome to Harry's E-commerce Website!</h1>
            <button onClick={handleRegisterClick}>Register</button>
            <button>Login</button>
        </div>
    );
}