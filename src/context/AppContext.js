import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [employees, setEmployees] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState(() => {
        const savedFavorites = localStorage.getItem('favorites');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    const addFavorite = (employee) => {
        setFavorites((prevFavorites) => {
            const updatedFavorites = prevFavorites.some((fav) => fav.login.uuid === employee.login.uuid)
                ? prevFavorites
                : [...prevFavorites, employee];
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    const removeFavorite = (employee) => {
        const updatedFavorites = favorites.filter((fav) => fav.login.uuid !== employee.login.uuid);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`https://randomuser.me/api/?results=10&seed=google`);
            setEmployees(response.data.results);
            setAllEmployees(response.data.results);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(`https://randomuser.me/api/?results=10&seed=${searchTerm}`);
            setEmployees(result.data.results);
            setAllEmployees(result.data.results);
        };

        fetchData();
    }, [searchTerm]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    return (
        <AppContext.Provider value={{ favorites, addFavorite, employees, allEmployees, setEmployees, setAllEmployees, removeFavorite, searchTerm, setSearchTerm }}>
            {children}
        </AppContext.Provider>
    );
};
