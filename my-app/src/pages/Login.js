import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../page-styles/login.css';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.log('Login Failed: ', errorData.message);
                alert('Invalid email or password!');
                return;
            }
            const data = await response.json();
            console.log('Login Successful');
            localStorage.setItem('user', JSON.stringify(data.user)); // Store user data if needed
            navigate('/home');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    }

    const backToRegister = () => {
        navigate('/register');
    }

    return (
        <div className="login">
            <form id="loginForm" onSubmit={handleSubmit}>
                <input className="loginInput" type="email" placeholder="EMAIL" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <input className="loginInput" type="password" placeholder="PASSWORD" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button className="loginButton" type="submit">LOGIN</button>
            </form>
            <button className="loginButton" onClick={backToRegister}>BACK TO REGISTER</button>
        </div>
    );
}