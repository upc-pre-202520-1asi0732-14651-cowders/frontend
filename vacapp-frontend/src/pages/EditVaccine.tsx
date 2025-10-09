import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vaccinesApi, bovinesApi, type UpdateVaccineRequest, type Bovine } from '../services/api';

const EditVaccine: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [bovines, setBovines] = useState<Bovine[]>([]);
    const [formData, setFormData] = useState<UpdateVaccineRequest>({
        name: '',
        vaccineType: '',
        vaccineDate: '',
        bovineId: 0,
    });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            setInitialLoading(true);
            const [vaccineData, bovinesData] = await Promise.all([
                vaccinesApi.getVaccineById(parseInt(id!)),
                bovinesApi.getAllBovines()
            ]);

            setFormData({
                name: vaccineData.name,
                vaccineType: vaccineData.vaccineType,
                vaccineDate: vaccineData.vaccineDate.split('T')[0],
                bovineId: vaccineData.bovineId,
            });
            setBovines(bovinesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load vaccine data');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'bovineId' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.vaccineType || !formData.vaccineDate || !formData.bovineId) {
            setError('Please fill in all required fields');
            return;
        }

        setIsLoading(true);

        try {
            await vaccinesApi.updateVaccine(parseInt(id!), formData);
            navigate(`/vaccines/${id}`);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update vaccine record');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f2f0e9' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#99bb99' }}></div>
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
                                onClick={() => navigate(`/vaccines/${id}`)}
                                className="text-sm font-medium transition duration-200 hover:opacity-70"
                                style={{ color: '#353330' }}
                            >
                                Cancel
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
            <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-4xl font-bold mb-4" style={{ color: '#353330' }}>Edit Vaccine</h2>
                    <p className="text-xl" style={{ color: '#353330', opacity: 0.8 }}>
                        Update vaccination record information
                    </p>
                </div>

                <div className="rounded-2xl shadow-xl border p-8" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Vaccine Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: '#353330' }}>
                                Vaccine Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition duration-200"
                                style={{ borderColor: '#e3e3d9', color: '#353330' }}
                                placeholder="e.g., Rabies Vaccine"
                            />
                        </div>

                        {/* Vaccine Type */}
                        <div>
                            <label htmlFor="vaccineType" className="block text-sm font-semibold mb-2" style={{ color: '#353330' }}>
                                Vaccine Type *
                            </label>
                            <input
                                type="text"
                                id="vaccineType"
                                name="vaccineType"
                                required
                                value={formData.vaccineType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition duration-200"
                                style={{ borderColor: '#e3e3d9', color: '#353330' }}
                                placeholder="e.g., Viral, Bacterial"
                            />
                        </div>

                        {/* Vaccine Date */}
                        <div>
                            <label htmlFor="vaccineDate" className="block text-sm font-semibold mb-2" style={{ color: '#353330' }}>
                                Vaccination Date *
                            </label>
                            <input
                                type="date"
                                id="vaccineDate"
                                name="vaccineDate"
                                required
                                value={formData.vaccineDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition duration-200"
                                style={{ borderColor: '#e3e3d9', color: '#353330' }}
                            />
                        </div>

                        {/* Bovine Selection */}
                        <div>
                            <label htmlFor="bovineId" className="block text-sm font-semibold mb-2" style={{ color: '#353330' }}>
                                Select Bovine *
                            </label>
                            <select
                                id="bovineId"
                                name="bovineId"
                                required
                                value={formData.bovineId}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition duration-200"
                                style={{ borderColor: '#e3e3d9', color: '#353330' }}
                            >
                                <option value="">Select a bovine</option>
                                {bovines.map(bovine => (
                                    <option key={bovine.id} value={bovine.id}>
                                        {bovine.name} - {bovine.breed}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                            <p className="text-sm text-yellow-700">
                                <strong>Note:</strong> Image updates are not supported in edit mode. To change the image, please delete and recreate the vaccine record.
                            </p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/vaccines/${id}`)}
                                className="flex-1 px-6 py-3 border-2 rounded-xl font-semibold transition duration-200 hover:opacity-80"
                                style={{ borderColor: '#a29f8a', color: '#a29f8a' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 text-white px-6 py-3 rounded-xl font-semibold transition duration-200 transform hover:scale-105 shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                {isLoading ? 'Updating...' : 'Update Vaccine Record'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditVaccine;