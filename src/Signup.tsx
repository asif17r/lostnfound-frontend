import React, { useState } from 'react';
import axios from 'axios';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [department, setDepartment] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const user = {
            name,
            email,
            password,
            address,
            department,
            role: 'USER'
        };

        try {
            const response = await axios.post('http://localhost:8080/register', user);
            if(response.status === 201){
                alert('Signup successful');
            }else{
                alert('An error occurred. Response status: ' + response.status);
            }
            // Redirect to login page
            window.location.href = '/login';
        } catch (error) {
            if(error instanceof Error) {
                alert("Error signing up: " + error.message);
            }else{
                alert('An error occurred. Please try again');
            }
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <br />
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Email:</label>
                    <br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Password:</label>
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Address:</label>
                    <br />
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </div>
                <br />
                <div>
                    <label>Department:</label>
                    <br />
                    <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                    />
                </div>
                <br />
                <button type="submit">Signup</button>
            </form>
        </div>
    );
};

export default Signup;