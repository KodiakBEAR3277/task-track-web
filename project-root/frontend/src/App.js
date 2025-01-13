import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './screens/Home';
import Projects from './screens/Projects';
import Admin from './screens/Admin';
import Student from './screens/Student';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { isAuthenticated, getUserRole } from './utils/auth';

const theme = createTheme();

function App() {
    const ProtectedRoute = ({ children }) => {
        const isAuth = isAuthenticated();
        if (!isAuth) {
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    return (
        <ThemeProvider theme={theme}>
            <Router basename="/task-track-web">
                <Routes>
                    <Route path="*" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    } />
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
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;