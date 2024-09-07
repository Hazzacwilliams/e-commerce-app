import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../page-styles/register.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form data:', formData);

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            console.log('Response status:', response.status); // Log the response status
            if (response.status === 409) {
                console.log('409 Conflict detected');
                alert("Email already registered with an account. Please login.");
            } else if (response.ok) {
                console.log('User was successfully registered');
                navigate('/login');
            } else {
                console.log('Failed to register user');
            }
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    const returnHome = () => {
        navigate('/');
    }
    const returnLogin = () => {
        navigate('/login');
    }
    return (
        <div>
            <form onSubmit={handleSubmit} id='registerForm'>
                <input className="registerInput" type="text" placeholder="NAME" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                <input className="registerInput" type="email" placeholder="EMAIL" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                <input className="registerInput" type="text" placeholder="PHONE" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                <input className="registerInput" type="text" placeholder="ADDRESS" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                <input className="registerInput" type="password" placeholder="PASSWORD" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button className="registerButton" type="submit">REGISTER</button>
                <button className='registerButton' id='smallerButton' onClick={returnLogin}>ALREADY HAVE AN ACCOUNT?</button>
                <button className="registerButton" onClick={returnHome}>HOME</button>
            </form>
        </div>
    );
}

export default Register;