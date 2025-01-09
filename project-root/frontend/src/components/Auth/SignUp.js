import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FormContainer,
    PageContainer,
    Input,
    Button,
    ErrorText,
    Title
} from './styles';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/signup', {
                username,
                email,
                password
            });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Sign up failed');
        }
    };

    return (
        <PageContainer>
            <Title>Task Track</Title>
            <FormContainer onSubmit={handleSignUp}>
                {error && <ErrorText>{error}</ErrorText>}
                <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <Button type="submit">Sign Up</Button>
            </FormContainer>
        </PageContainer>
    );
};

export default SignUp;