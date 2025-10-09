import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vaccinesApi, bovinesApi, type Vaccine, type Bovine } from '../services/api';

const VaccineDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [vaccine, setVaccine] = useState<Vaccine | null>(null);
    const [bovine, setBovine] = useState<Bovine | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (id) {
            fetchVaccineDetails();
        }
    }, [id]);

    const fetchVaccineDetails = async () => {
        try {
            setLoading(true);
            const vaccineData = await vaccinesApi.getVaccineById(parseInt(id!));
            setVaccine(vaccineData);

            const bovineData = await bovinesApi.getBovineById(vaccineData.bovineId);
            setBovine(bovineData);
        } catch (error) {
            console.error('Error fetching vaccine details:', error);
            setError('Failed to load vaccine details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this vaccine record?')) {
            try {
                await vaccinesApi.deleteVaccine(parseInt(id!));
                navigate('/vaccines');
            } catch (error) {
                console.error('Error deleting vaccine:', error);
                setError('Failed to delete vaccine');
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f2f0e9' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#99bb99' }}></div>
            </div>
        );
    }

    if (error || !vaccine) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f2f0e9' }}>
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#353330' }}>Error</h2>
                    <p style={{ color: '#353330', opacity: 0.8 }}>{error || 'Vaccine not found'}</p>
                    <button
                        onClick={() => navigate('/vaccines')}
                        className="mt-4 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
                        style={{ backgroundColor: '#99bb99' }}
                    >
                        Back to Vaccines
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f2f0e9' }}>
            {/* Navigation */}
            <nav className="shadow-lg border-b sticky top-0 z-40" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#99bb99' }}>
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold" style={{ color: '#353330' }}>Moobile</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/vaccines')}
                                className="text-sm font-medium transition duration-200 hover:opacity-70"
                                style={{ color: '#353330' }}
                            >
                                Back to Vaccines
                            </button>
                            <button
                                onClick={handleLogout}
                                className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 transform hover:scale-105 shadow-md hover:opacity-90"
                                style={{ backgroundColor: '#a29f8a' }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold mb-4" style={{ color: '#353330' }}>Vaccine Details</h2>
                    <p className="text-xl" style={{ color: '#353330', opacity: 0.8 }}>
                        Complete vaccination record information
                    </p>
                </div>

                <div className="rounded-2xl shadow-xl border overflow-hidden" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                    {/* Image Section */}
                    {vaccine.vaccineImg && (
                        <div className="h-80 bg-gray-200">
                            <img
                                src={vaccine.vaccineImg}
                                alt={vaccine.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Details Section */}
                    <div className="p-8">
                        <h3 className="text-3xl font-bold mb-6" style={{ color: '#353330' }}>{vaccine.name}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-4 rounded-xl border" style={{ backgroundColor: '#e3e3d9', borderColor: '#a29f8a' }}>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#353330', opacity: 0.7 }}>Vaccine Type</p>
                                <p className="text-lg font-bold" style={{ color: '#353330' }}>{vaccine.vaccineType}</p>
                            </div>

                            <div className="p-4 rounded-xl border" style={{ backgroundColor: '#e3e3d9', borderColor: '#a29f8a' }}>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#353330', opacity: 0.7 }}>Vaccination Date</p>
                                <p className="text-lg font-bold" style={{ color: '#353330' }}>
                                    {new Date(vaccine.vaccineDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border" style={{ backgroundColor: '#e3e3d9', borderColor: '#a29f8a' }}>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#353330', opacity: 0.7 }}>Bovine</p>
                                <p className="text-lg font-bold" style={{ color: '#353330' }}>{bovine?.name || 'Unknown'}</p>
                            </div>

                            <div className="p-4 rounded-xl border" style={{ backgroundColor: '#e3e3d9', borderColor: '#a29f8a' }}>
                                <p className="text-sm font-semibold mb-1" style={{ color: '#353330', opacity: 0.7 }}>Record ID</p>
                                <p className="text-lg font-bold" style={{ color: '#353330' }}>#{vaccine.id}</p>
                            </div>
                        </div>

                        {/* Bovine Information */}
                        {bovine && (
                            <div className="mb-8 p-6 rounded-xl border" style={{ backgroundColor: '#e3e3d9', borderColor: '#a29f8a' }}>
                                <h4 className="text-xl font-bold mb-4" style={{ color: '#353330' }}>Bovine Information</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-semibold" style={{ color: '#353330', opacity: 0.7 }}>Name:</p>
                                        <p style={{ color: '#353330' }}>{bovine.name}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold" style={{ color: '#353330', opacity: 0.7 }}>Breed:</p>
                                        <p style={{ color: '#353330' }}>{bovine.breed}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold" style={{ color: '#353330', opacity: 0.7 }}>Gender:</p>
                                        <p style={{ color: '#353330' }}>{bovine.gender}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold" style={{ color: '#353330', opacity: 0.7 }}>Location:</p>
                                        <p style={{ color: '#353330' }}>{bovine.location}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/bovines/${bovine.id}`)}
                                    className="mt-4 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 hover:opacity-90"
                                    style={{ backgroundColor: '#99bb99' }}
                                >
                                    View Bovine Details
                                </button>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={() => navigate(`/vaccines/${vaccine.id}/edit`)}
                                className="flex-1 text-white px-6 py-3 rounded-xl font-semibold transition duration-200 transform hover:scale-105 shadow-md hover:opacity-90"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                Edit Vaccine
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 text-white px-6 py-3 rounded-xl font-semibold transition duration-200 transform hover:scale-105 shadow-md hover:opacity-90"
                                style={{ backgroundColor: '#d66' }}
                            >
                                Delete Vaccine
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VaccineDetails;