import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import EmployeeList from './components/EmployeeList';
import EmployeeDetails from './components/EmployeeDetails';
import Favorites from './components/Favorites';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
    return (
        <AppProvider>
            <Router>
                <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
                    <div className="container-fluid">
                        <Link to="/" className="navbar-brand">Employee Manager</Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav ms-auto">
                                <li className="nav-item">
                                    <Link to="/" className="nav-link">Home</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/favorites" className="nav-link">Favorites</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container">
                    <Routes>
                        <Route path="/" element={<EmployeeList />} />
                        <Route path="/:searchTerm" element={<EmployeeList />} />
                        <Route path="/employee" element={<EmployeeDetails />} />
                        <Route path="/favorites" element={<Favorites />} />
                    </Routes>
                </div>
            </Router>
        </AppProvider>
    );
};

export default App;
