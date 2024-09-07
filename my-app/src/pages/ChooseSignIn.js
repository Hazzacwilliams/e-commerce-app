import React from "react";
import { useNavigate } from "react-router-dom";

import '../page-styles/ChooseSignIn.css';

export default function ChooseSignIn() {

    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    }

    const handleLoginClick = () => {
        navigate('/login');
    }

    return (
        <div className="home">
            <h1 id="storeName">HARRY'S PRODUCT EMPORIUM</h1>
            <div id="buttonContainer">
                <button className="buttons" onClick={handleRegisterClick}>REGISTER</button>
                <button className="buttons" onClick={handleLoginClick}>LOGIN</button>
            </div>
            
        </div>
    );
}