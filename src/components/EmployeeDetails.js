import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../context/AppContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import '../App.css';
import placeholderIcon from '../icons/placeholder.png'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeDetails = () => {
    const { allEmployees } = useContext(AppContext);
    const [searchParams] = useSearchParams();
    const index = searchParams.get('index');
    const [employee, setEmployee] = useState(null);
    const [showMap, setShowMap] = useState(true); 
    const [showDetail, setShowDetail] = useState(null); 

    useEffect(() => {
        if (index !== null) {
            const foundEmployee = allEmployees[parseInt(index)];
            setEmployee(foundEmployee);
        }
    }, [index, allEmployees]);

    if (!employee) return <div>Loading...</div>;

    // Function to handle showing details on icon click
    const handleIconClick = (detail) => {
        setShowDetail(detail);
    };

    // Employee's coordinates
    const employeeCoordinates = [
        parseFloat(employee.location.coordinates.latitude),
        parseFloat(employee.location.coordinates.longitude)
    ];

  
    const customIcon = new L.Icon({
        iconUrl: placeholderIcon,
        iconSize: [35, 45],
        iconAnchor: [17, 45],
        popupAnchor: [0, -45]
    });

   
    const FitBoundsToMarker = ({ coordinates }) => {
        const map = useMap();
        useEffect(() => {
            map.fitBounds([coordinates]);
        }, [map, coordinates]);
        return null;
    };

    
    const renderModalContent = () => {
        switch (showDetail) {
            case 'email':
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Email</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDetail(null)}></button>
                        </div>
                        <div className="modal-body">
                            <p>{employee.email}</p>
                        </div>
                    </div>
                );
            case 'phone':
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Phone</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDetail(null)}></button>
                        </div>
                        <div className="modal-body">
                            <p>{employee.phone}</p>
                        </div>
                    </div>
                );
            case 'location':
                return (
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Location</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDetail(null)}></button>
                        </div>
                        <div className="modal-body">
                            <p>{employee.location.street.name}, {employee.location.city}</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="employee-container">
            <div className="card shadow rounded overflow-hidden d-flex flex-column justify-content-center mx-auto p-4" style={{ maxWidth: '600px' }}>
                <img src={employee.picture.large} alt={employee.name.first} className="rounded-circle mx-auto d-block mb-3" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                <div className="employee-info">
                    <h3 className="text-center">{employee.name.first} {employee.name.last}</h3>
                    <div className="icon-container d-flex justify-content-around">
                        <FontAwesomeIcon
                            icon={faEnvelope}
                            className="info-icon"
                            onClick={() => handleIconClick('email')}
                            title="Email"
                        />
                        <FontAwesomeIcon
                            icon={faPhone}
                            className="info-icon"
                            onClick={() => handleIconClick('phone')}
                            title="Phone"
                        />
                        <FontAwesomeIcon
                            icon={faMapMarkerAlt}
                            className="info-icon"
                            onClick={() => handleIconClick('location')}
                            title="Location"
                        />
                    </div>
                </div>
            </div>

            <button onClick={() => setShowMap(!showMap)} className='btn btn-warning mx-auto d-flex mt-3' style={{ width: 'fit-content' }}>
                {showMap ? "Hide Map" : "Show Map"}
            </button>

            {showMap && (
                <div className="map-container mt-3 mx-auto" style={{ width: '100%', maxWidth: '600px' }}>
                    <MapContainer center={employeeCoordinates} zoom={12} style={{ height: '400px', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={employeeCoordinates} icon={customIcon}>
                            <Popup>
                                <div>
                                    <img src={employee.picture.thumbnail} alt={`${employee.name.first} ${employee.name.last}`} style={{ width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px' }} />
                                    <p>{`${employee.name.title} ${employee.name.first} ${employee.name.last}`}</p>
                                    <p>{employee.location.street.name}, {employee.location.city}</p>
                                    <p>{employee.email}</p>
                                </div>
                            </Popup>
                        </Marker>
                        <FitBoundsToMarker coordinates={employeeCoordinates} />
                    </MapContainer>
                </div>
            )}

           
            {showDetail && (
                <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }} aria-modal="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            {renderModalContent()}
                        </div>
                    </div>
                </div>
            )}
            {showDetail && <div className="modal-backdrop fade show"></div>}
           
            <Link to="/" className="btn btn-danger position-fixed bottom-0 start-0 m-3">
                GO BACK
            </Link>
        </div>
    );
};

export default EmployeeDetails;
