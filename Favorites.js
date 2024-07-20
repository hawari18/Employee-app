import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const Favorites = () => {
    const navigate = useNavigate();
    const { favorites, removeFavorite } = useContext(AppContext);

    const handleMoreDetails = (employee, index) => {
        const companyName = employee.company ? employee.company.name : 'unknown';
        navigate(`/employee?company=${companyName}&index=${index}`);
    };

    return (
        <div className='container mx-auto p-4'>
            <h2 className='heading-fav'>Favorites</h2>
            <ul className="list-unstyled d-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {favorites.map((employee, index) => (
                    <li key={employee.login.uuid} className="card bg-white shadow-xl rounded-lg overflow-hidden border border-danger mb-4 p-3">
                        <img src={employee.picture.large} alt={employee.name.first} className="rounded-full mb-2" />
                        <h3 className="text-xl font-bold">{employee.name.first} {employee.name.last}</h3>
                        <p>Age: {employee.dob.age}</p>
                        <p>Location: {employee.location.city}, {employee.location.country}</p>
                        <div className='btn-container p-1.3 d-flex justify-between'>
                            <button className='btn btn-secondary p-1.4' onClick={() => handleMoreDetails(employee, index)}>
                                More Details
                            </button>
                            <button onClick={() => removeFavorite(employee)} className='btn btn-primary p-0'>Remove Favorites</button>
                        </div>
                    </li>
                ))}
            </ul>
            <Link to="/" className="btn btn-danger position-fixed bottom-0 start-0 m-3">
                GO BACK
            </Link>
        </div>
    );
};

export default Favorites;
