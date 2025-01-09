import React, { useState } from 'react';
import {
    FormContainer,
    PageContainer,
    Input,
    Button,
    SignUpLink,
    ErrorText,
    Title
} from './styles';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.user_id,
                    username: data.username
                }));
                
                window.location.href = '/projects';
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
        }
    };

    const handleSignupClick = () => {
        window.location.href = '/signup';
    };

    return (
        <PageContainer>
            <Title>Task Track</Title>
            <FormContainer onSubmit={handleLogin}>
                {error && <ErrorText>{error}</ErrorText>}
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
                <Button type="submit">Login</Button>
                <SignUpLink>
                    Don't have an account?{' '}
                    <button onClick={handleSignupClick}>Sign up</button>
                </SignUpLink>
            </FormContainer>
        </PageContainer>
    );
};

export default Login;
