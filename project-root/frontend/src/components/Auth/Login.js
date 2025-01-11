import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Title, 
    FormContainer, 
    Input, 
    ErrorText, 
    SignUpLink, 
    PageContainer, 
    StyledButton,
    InputWrapper,
    ErrorMessage 
} from './styles';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({ email: false, password: false });
    const navigate = useNavigate();

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const getFieldError = (field) => {
        if (!touched[field]) return '';
        
        switch(field) {
            case 'email':
                if (!email.trim()) return 'Email is required';
                if (!email.includes('@')) return 'Please enter a valid email';
                return '';
            case 'password':
                if (!password.trim()) return 'Password is required';
                return '';
            default:
                return '';
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        const emailError = getFieldError('email');
        const passwordError = getFieldError('password');

        if (emailError || passwordError) {
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password })
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

    const handleSignupClick = (e) => {
        e.preventDefault();
        navigate('/signup');
    };

    return (
        <PageContainer>
            <Title>Task Track</Title>
            <FormContainer onSubmit={handleLogin}>
                {error && <ErrorText>{error}</ErrorText>}
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
                        placeholder="Password"
                        onBlur={() => handleBlur('password')}
                        hasError={touched.password && getFieldError('password')}
                    />
                    <ErrorMessage className={touched.password && getFieldError('password') ? 'visible' : ''}>
                        {getFieldError('password')}
                    </ErrorMessage>
                </InputWrapper>
                <StyledButton type="submit">
                    Login
                </StyledButton>
                <SignUpLink>
                    Don't have an account?{' '}
                    <button type="button" onClick={handleSignupClick}>Sign up</button>
                </SignUpLink>
            </FormContainer>
        </PageContainer>
    );
};

export default Login;
