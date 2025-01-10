import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token) {
            navigate('/login');
        } else {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12">
                    <h2>Welcome {user?.email}</h2>
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Quick Actions</h5>
                            <div className="d-grid gap-2 d-md-flex">
                                <button className="btn btn-primary" onClick={() => navigate('/tasks')}>
                                    View Tasks
                                </button>
                                <button className="btn btn-success" onClick={() => navigate('/tasks/new')}>
                                    Create Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;