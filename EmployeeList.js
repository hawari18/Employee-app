import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; 
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons'; 
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'; 

const EmployeeList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { favorites, addFavorite, employees, allEmployees, setEmployees, setSearchTerm, searchTerm } = useContext(AppContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5);
    const [filterGroup, setFilterGroup] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all'); 

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const debouncedSearch = useCallback(debounce((searchValue) => {
        filterEmployees(searchValue, filterGroup, genderFilter);
    }, 300), [filterGroup, genderFilter]);

    const filterEmployees = useCallback((searchValue, group, gender) => {
        let filteredEmployees = allEmployees;

        if (group !== 'all') {
            filteredEmployees = allEmployees.filter(employee => {
                if (group === 'manager') {
                    return employee.dob.age >= 40; 
                } else if (group === 'worker') {
                    return employee.dob.age >= 25 && employee.dob.age < 40; 
                } else if (group === 'junior') {
                    return employee.dob.age < 25; 
                }
                return true;
            });
        }

        if (gender !== 'all') {
            filteredEmployees = filteredEmployees.filter(employee => employee.gender === gender);
        }

        if (searchValue) {
            filteredEmployees = filteredEmployees.filter(employee => 
                employee.name.first.toLowerCase().includes(searchValue.toLowerCase()) || 
                employee.name.last.toLowerCase().includes(searchValue.toLowerCase()));
        }

        setEmployees(filteredEmployees);
    }, [allEmployees, setEmployees]);

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        debouncedSearch(value);
        setCurrentPage(1);
        navigate(`/?search=${value}`);
    };

    const handleGroupChange = (group) => {
        setFilterGroup(group);
        filterEmployees(searchTerm, group, genderFilter);
    };

    const handleGenderChange = (gender) => {
        setGenderFilter(gender);
        filterEmployees(searchTerm, filterGroup, gender);
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(`https://randomuser.me/api/?results=10&seed=${searchTerm}`);
            setEmployees(result.data.results);
        };

        fetchData();
    }, [searchTerm, setEmployees]);

    const isFavorite = (employee) => {
        return favorites.some(fav => fav.login.uuid === employee.login.uuid);
    };

    const handleSortManagers = () => {
        handleGroupChange('manager');
    };

    const handleSortWorkers = () => {
        handleGroupChange('worker');
    };

    const handleSortJuniors = () => {
        handleGroupChange('junior');
    };

    const handleMoreDetails = (employee, index) => {
        const companyName = employee.company ? employee.company.name : 'unknown'; 
        navigate(`/employee?company=${companyName}&index=${index}`);
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchValue = params.get('search') || '';
        setSearchTerm(searchValue);
        filterEmployees(searchValue, filterGroup, genderFilter);
    }, [location.search, filterEmployees, filterGroup, genderFilter]);

    return (
        <div className="container mx-auto p-4">
            <div className="d-flex flex-column gap-3 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search employees"
                    className="form-control mb-3"
                    style={{ fontSize: '1.2rem', padding: '10px' }}
                />

                <div className="form-group">
                    <label htmlFor="filterGender">Sort by Gender:</label>
                    <select
                        id="filterGender"
                        className="form-control"
                        value={genderFilter}
                        onChange={(e) => handleGenderChange(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                <div className="btn-group">
                    <button className="btn btn-primary me-2" onClick={handleSortManagers}>Managers</button>
                    <button className="btn btn-primary me-2" onClick={handleSortWorkers}>Workers</button>
                    <button className="btn btn-primary me-2" onClick={handleSortJuniors}>Juniors</button>
                </div>
            </div>

            <ul className="list-unstyled d-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {currentEmployees.map((employee, index) => (
                    <li key={employee.login.uuid} className="card bg-white shadow rounded-lg overflow-hidden border border-primary mb-4 p-3">
                        <img src={employee.picture.large} alt={employee.name.first} className="rounded-full mb-2" />
                        <h3 className="text-xl font-bold">{employee.name.first} {employee.name.last}</h3>
                        <p>Age: {employee.dob.age}</p>
                        <p>
                            <FontAwesomeIcon
                                icon={faMapMarkerAlt}
                                className="info-icon"
                                title="Location"
                            /> {employee.location.city}, {employee.location.country}
                        </p>
                        <div className="btn-container d-flex justify-between">
                            <button className="btn btn-secondary" onClick={() => handleMoreDetails(employee, index)}>
                                <i className="bi bi-info-circle"></i> More Details
                            </button>
                            <FontAwesomeIcon
                                icon={isFavorite(employee) ? solidStar : regularStar}
                                className={isFavorite(employee) ? 'text-warning' : 'text-secondary'}
                                size="lg"
                                onClick={() => addFavorite(employee)}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                    </li>
                ))}
            </ul>

            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: Math.ceil(employees.length / employeesPerPage) }, (_, i) => (
                        <li key={i + 1} className="page-item">
                            <button onClick={() => paginate(i + 1)} className="page-link">
                                {i + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default EmployeeList;
