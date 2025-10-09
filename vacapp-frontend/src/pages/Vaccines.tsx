import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { vaccinesApi, bovinesApi, type Vaccine, type Bovine } from '../services/api';

const Vaccines: React.FC = () => {
    const navigate = useNavigate();
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [bovines, setBovines] = useState<Bovine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [filterBovineId, setFilterBovineId] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [vaccinesData, bovinesData] = await Promise.all([
                vaccinesApi.getAllVaccines(),
                bovinesApi.getAllBovines()
            ]);
            setVaccines(vaccinesData);
            setBovines(bovinesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load vaccines');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this vaccine record?')) {
            try {
                await vaccinesApi.deleteVaccine(id);
                setVaccines(vaccines.filter(v => v.id !== id));
            } catch (error) {
                console.error('Error deleting vaccine:', error);
                setError('Failed to delete vaccine');
            }
        }
    };

    const getBovineName = (bovineId: number) => {
        const bovine = bovines.find(b => b.id === bovineId);
        return bovine ? bovine.name : 'Unknown';
    };

    const filteredVaccines = filterBovineId === 'all'
        ? vaccines
        : vaccines.filter(v => v.bovineId === parseInt(filterBovineId));

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
                                onClick={() => navigate('/home')}
                                className="text-sm font-medium transition duration-200 hover:opacity-70"
                                style={{ color: '#353330' }}
                            >
                                Home
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold mb-4" style={{ color: '#353330' }}>Vaccine Management</h2>
                    <p className="text-xl" style={{ color: '#353330', opacity: 0.8 }}>
                        Track and manage vaccination records for your livestock
                    </p>
                </div>

                {/* Actions Bar */}
                <div className="rounded-2xl shadow-lg border p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                    <div className="flex items-center space-x-4 flex-1">
                        <label htmlFor="filter" className="font-semibold" style={{ color: '#353330' }}>
                            Filter by Bovine:
                        </label>
                        <select
                            id="filter"
                            value={filterBovineId}
                            onChange={(e) => setFilterBovineId(e.target.value)}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition duration-200"
                            style={{ borderColor: '#e3e3d9', color: '#353330' }}
                        >
                            <option value="all">All Bovines</option>
                            {bovines.map(bovine => (
                                <option key={bovine.id} value={bovine.id}>
                                    {bovine.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => navigate('/vaccines/add')}
                        className="text-white px-6 py-2 rounded-lg font-medium transition duration-200 transform hover:scale-105 shadow-md hover:opacity-90 flex items-center space-x-2"
                        style={{ backgroundColor: '#99bb99' }}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Vaccine</span>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#99bb99' }}></div>
                    </div>
                ) : filteredVaccines.length === 0 ? (
                    <div className="text-center py-16 rounded-2xl shadow-lg border" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                        <div className="h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e3e3d9' }}>
                            <svg className="h-12 w-12" style={{ color: '#99bb99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2" style={{ color: '#353330' }}>No Vaccines Found</h3>
                        <p className="mb-6" style={{ color: '#353330', opacity: 0.7 }}>
                            {filterBovineId === 'all'
                                ? 'Start by adding your first vaccine record'
                                : 'No vaccines found for the selected bovine'}
                        </p>
                        <button
                            onClick={() => navigate('/vaccines/add')}
                            className="text-white px-6 py-3 rounded-lg font-medium transition duration-200 transform hover:scale-105 shadow-md hover:opacity-90"
                            style={{ backgroundColor: '#99bb99' }}
                        >
                            Add First Vaccine
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVaccines.map((vaccine) => (
                            <div
                                key={vaccine.id}
                                className="rounded-2xl shadow-lg border p-6 hover:shadow-xl transition duration-300 transform hover:scale-105"
                                style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}
                            >
                                {vaccine.vaccineImg && (
                                    <div className="mb-4 rounded-xl overflow-hidden h-48 bg-gray-200">
                                        <img
                                            src={vaccine.vaccineImg}
                                            alt={vaccine.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="mb-4">
                                    <h3 className="text-xl font-bold mb-2" style={{ color: '#353330' }}>{vaccine.name}</h3>
                                    <div className="space-y-2 text-sm" style={{ color: '#353330', opacity: 0.8 }}>
                                        <p><span className="font-semibold">Type:</span> {vaccine.vaccineType}</p>
                                        <p><span className="font-semibold">Date:</span> {new Date(vaccine.vaccineDate).toLocaleDateString()}</p>
                                        <p><span className="font-semibold">Bovine:</span> {getBovineName(vaccine.bovineId)}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/vaccines/${vaccine.id}`)}
                                        className="flex-1 text-white py-2 px-4 rounded-lg font-medium transition duration-200 hover:opacity-90"
                                        style={{ backgroundColor: '#99bb99' }}
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => navigate(`/vaccines/${vaccine.id}/edit`)}
                                        className="flex-1 py-2 px-4 rounded-lg font-medium transition duration-200 border-2 hover:opacity-80"
                                        style={{ borderColor: '#99bb99', color: '#99bb99' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(vaccine.id)}
                                        className="flex-1 text-white py-2 px-4 rounded-lg font-medium transition duration-200 hover:opacity-90"
                                        style={{ backgroundColor: '#d66' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Vaccines;