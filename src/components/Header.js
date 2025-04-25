import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
                    <h1>Kanban Board</h1>
                </Link>
                <div>
                    {isAuthenticated ? (
                        <>
                            <span style={{ marginRight: '15px' }}>{user?.email}</span>
                            <button className="btn-secondary" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                <button className="btn-primary" style={{ marginRight: '10px' }}>
                                    Login
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="btn-secondary">Sign Up</button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;