import { styled } from '@mui/material/styles';

const colors = {
  primary: '#FFC600', // Brighter yellow
  secondary: '#222222', // Softer black
  text: '#FFFFFF',
  textDark: '#000000',
  error: '#FF3B3B',
  containerBg: 'rgba(255, 255, 255, 0.95)',
  hover: '#FFE333'
};

export const FormContainer = styled('form')({
  width: '100%',
  maxWidth: '400px',
  padding: '2rem',
  backgroundColor: colors.containerBg,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  fontFamily: 'Inter, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  '@media (max-width: 480px)': {
    padding: '20px',
    maxWidth: '95%'
  }
});

export const PageContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: colors.secondary,
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  margin: 0,
  boxSizing: 'border-box',
  '@media (max-width: 480px)': {
    padding: '10px'
  }
});

export const Input = styled('input')({
  width: '100%',
  padding: '0.875rem 1rem',
  marginBottom: '1rem',
  border: '2px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  fontSize: '1rem',
  fontFamily: 'Inter, sans-serif',
  color: colors.textDark,  // Add this line
  backgroundColor: '#ffffff',  // Add this line
  transition: 'all 0.2s ease',
  '&:focus': {
    outline: 'none',
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px rgba(255, 221, 0, 0.2)`
  },
  '&::placeholder': {
    color: 'rgba(0, 0, 0, 0.5)'  // Add this line
  }
});

export const Button = styled('button')({
  width: '100%',
  padding: '0.875rem',
  backgroundColor: colors.primary,
  color: colors.textDark,
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: 'Inter, sans-serif',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: colors.hover,
    transform: 'translateY(-1px)'
  }
});

export const StyledButton = styled('button')({
  width: '100%',
  padding: '12px',
  backgroundColor: colors.primary,
  color: colors.textDark,
  border: 'none',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: colors.hover,
  },
  '&:disabled': {
    backgroundColor: colors.primary,
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  '&:focus': {
    backgroundColor: colors.primary,
    outline: 'none',
  },
  '&:active': {
    backgroundColor: colors.hover,
  },
  '&.error': {
    backgroundColor: colors.primary,
  }
});

export const Title = styled('h1')({
  fontFamily: 'Inter, sans-serif',
  fontSize: '2.5rem',
  fontWeight: 700,
  color: colors.primary,
  marginBottom: '2rem',
  letterSpacing: '-0.02em',
  textAlign: 'center',
  '@media (max-width: 480px)': {
    fontSize: '2rem'
  }
});

export const ErrorMessage = styled('div')({
    color: '#ff0000',
    marginBottom: '1rem',
    fontSize: '14px'
});

export const SignUpLink = styled('div')({
  marginTop: '1.5rem',
  textAlign: 'center',
  color: colors.textDark,
  fontSize: '0.875rem',
  fontFamily: 'Inter, sans-serif',
  '& button': {
    background: 'none',
    border: 'none',
    color: colors.primary,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: colors.hover
    }
  }
});

export const ErrorText = styled('div')({
  color: colors.error,
  fontSize: '14px',
  textAlign: 'center'
});
