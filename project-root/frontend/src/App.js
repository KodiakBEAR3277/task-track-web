import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './screens/Home';
import Projects from './screens/Projects';
import Admin from './screens/Admin';
import Student from './screens/Student';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme();

function App() {
    // Check if user is authenticated
    const isAuthenticated = () => {
        return localStorage.getItem('token') !== null;
    };

    // Protected Route component
    const ProtectedRoute = ({ children }) => {
        if (!isAuthenticated()) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={
                        isAuthenticated() ? <Navigate to="/projects" replace /> : <Login />
                    } />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Protected routes */}
                    <Route path="/projects" element={
                        <ProtectedRoute>
                            <Projects />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <Admin />
                        </ProtectedRoute>
                    } />
                    <Route path="/student" element={
                        <ProtectedRoute>
                            <Student />
                        </ProtectedRoute>
                    } />
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />

                    {/* Root route redirects based on authentication */}
                    <Route path="/" element={
                        isAuthenticated() ? <Navigate to="/projects" replace /> : <Navigate to="/login" replace />
                    } />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;