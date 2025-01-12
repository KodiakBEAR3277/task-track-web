import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Title, 
    FormContainer, 
    Input, 
    ErrorText, 
    PageContainer,
    InputWrapper,
    ErrorMessage,
    StyledButton 
} from './styles';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({ username: false, email: false, password: false });
    const navigate = useNavigate();

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field) => {
        if (!touched[field]) return '';
        
        switch(field) {
            case 'username':
                return !username.trim() ? 'Username is required' : '';
            case 'email':
                if (!email.trim()) return 'Email is required';
                if (!email.includes('@')) return 'Please enter a valid email';
                return '';
            case 'password':
                if (!password.trim()) return 'Password is required';
                if (password.length < 6) return 'Password must be at least 6 characters';
                return '';
            default:
                return '';
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setTouched({ username: true, email: true, password: true });

        const usernameError = getFieldError('username');
        const emailError = getFieldError('email');
        const passwordError = getFieldError('password');

        // Block submission if any field is empty or has errors
        if (!username.trim() || !email.trim() || !password.trim() || 
            usernameError || emailError || passwordError) {
            setError('Please fill in all fields correctly');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    email: email.trim(),
                    password
                })
            });

            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.error || 'Sign up failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <PageContainer>
            <Title>Task Track</Title>
            <FormContainer onSubmit={handleSignUp}>
                {error && <ErrorText>{error}</ErrorText>}
                <InputWrapper hasError={touched.username && getFieldError('username')}>
                    <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onBlur={() => handleBlur('username')}
                        placeholder="Username"
                        hasError={touched.username && getFieldError('username')}
                    />
                    <ErrorMessage className={touched.username && getFieldError('username') ? 'visible' : ''}>
                        {getFieldError('username')}
                    </ErrorMessage>
                </InputWrapper>
                <InputWrapper hasError={touched.email && getFieldError('email')}>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => handleBlur('email')}
                        placeholder="Email"
                        hasError={touched.email && getFieldError('email')}
                    />
                    <ErrorMessage className={touched.email && getFieldError('email') ? 'visible' : ''}>
                        {getFieldError('email')}
                    </ErrorMessage>
                </InputWrapper>
                <InputWrapper hasError={touched.password && getFieldError('password')}>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() => handleBlur('password')}
                        placeholder="Password"
                        hasError={touched.password && getFieldError('password')}
                    />
                    <ErrorMessage className={touched.password && getFieldError('password') ? 'visible' : ''}>
                        {getFieldError('password')}
                    </ErrorMessage>
                </InputWrapper>
                <StyledButton type="submit">
                    Sign Up
                </StyledButton>
            </FormContainer>
        </PageContainer>
    );
};

export default SignUp;