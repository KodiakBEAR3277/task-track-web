import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, FormContainer, Input, ErrorText, SignUpLink, PageContainer, StyledButton } from './styles';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/home');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to connect to server');
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
                <StyledButton type="submit" className={error ? 'error' : ''}>
                    Login
                </StyledButton>
                <SignUpLink>
                    Don't have an account?{' '}
                    <button onClick={handleSignupClick}>Sign up</button>
                </SignUpLink>
            </FormContainer>
        </PageContainer>
    );
};

export default Login;
