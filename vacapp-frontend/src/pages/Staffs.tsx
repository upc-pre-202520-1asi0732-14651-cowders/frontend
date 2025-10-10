import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffApi, type Staff, EmployeeStatus } from '../services/api';

const Staffs: React.FC = () => {
    const navigate = useNavigate();
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<number | 'all'>('all');

    useEffect(() => {
        fetchStaff();
    }, []);

    useEffect(() => {
        filterStaffList();
    }, [searchTerm, filterStatus, staffList]);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await staffApi.getAllStaff();
            setStaffList(data);
            setFilteredStaff(data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cargar el personal');
            console.error('Error fetching staff:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterStaffList = () => {
        let filtered = staffList;

        if (searchTerm) {
            filtered = filtered.filter(staff =>
                staff.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(staff => staff.employeeStatus === filterStatus);
        }

        setFilteredStaff(filtered);
    };

    const handleDelete = async (id: number, name: string) => {
        if (window.confirm(`¿Estás seguro de eliminar a ${name}?`)) {
            try {
                await staffApi.deleteStaff(id);
                fetchStaff();
            } catch (err: any) {
                alert(err.response?.data?.message || 'Error al eliminar el personal');
            }
        }
    };

    const getStatusLabel = (status: number): string => {
        switch (status) {
            case EmployeeStatus.Active: return 'Activo';
            case EmployeeStatus.Inactive: return 'Inactivo';
            case EmployeeStatus.OnLeave: return 'De Licencia';
            case EmployeeStatus.Retired: return 'Retirado';
            case EmployeeStatus.Terminated: return 'Terminado';
            default: return 'Desconocido';
        }
    };

    const getStatusStyles = (status: number): { backgroundColor: string; color: string } => {
        switch (status) {
            case EmployeeStatus.Active: return { backgroundColor: '#99bb99', color: 'white' };
            case EmployeeStatus.Inactive: return { backgroundColor: '#e3e3d9', color: '#353330' };
            case EmployeeStatus.OnLeave: return { backgroundColor: '#a29f8a', color: 'white' };
            case EmployeeStatus.Retired: return { backgroundColor: '#c3c2b6', color: '#353330' };
            case EmployeeStatus.Terminated: return { backgroundColor: '#e57373', color: 'white' };
            default: return { backgroundColor: '#e3e3d9', color: '#353330' };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen" style={{ backgroundColor: '#f2f0e9' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#99bb99' }}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f2f0e9' }}>
            <nav className="shadow-lg border-b sticky top-0 z-40" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-2xl font-bold" style={{ color: '#353330' }}>Personal</h1>
                        <button
                            onClick={() => navigate('/staff/add')}
                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 hover:opacity-90"
                            style={{ backgroundColor: '#99bb99' }}
                        >
                            + Agregar Personal
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {error && (
                    <div className="rounded-xl border p-4 mb-6" style={{ backgroundColor: '#e3e3d9', borderColor: '#a29f8a', color: '#353330' }}>
                        {error}
                    </div>
                )}

                <div className="rounded-2xl shadow-xl border p-6 mb-8" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Buscar por nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                            />
                        </div>
                        <div className="md:w-64">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                            >
                                <option value="all">Todos los estados</option>
                                <option value={EmployeeStatus.Active}>Activo</option>
                                <option value={EmployeeStatus.Inactive}>Inactivo</option>
                                <option value={EmployeeStatus.OnLeave}>De Licencia</option>
                                <option value={EmployeeStatus.Retired}>Retirado</option>
                                <option value={EmployeeStatus.Terminated}>Terminado</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredStaff.length === 0 ? (
                    <div className="text-center py-12 rounded-2xl border" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                        <div className="h-16 w-16 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e3e3d9' }}>
                            <svg className="h-8 w-8" style={{ color: '#99bb99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M9 20h6v-2a6 6 0 00-12 0v2m6-9a4 4 0 100-8 4 4 0 000 8m8 0a4 4 0 100-8 4 4 0 000 8" />
                            </svg>
                        </div>
                        <p style={{ color: '#353330', opacity: 0.7 }}>No se encontró personal</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStaff.map((staff) => (
                            <div
                                key={staff.id}
                                className="rounded-2xl shadow-lg border p-6 hover:shadow-xl transition duration-300"
                                style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold" style={{ color: '#353330' }}>
                                        {staff.name}
                                    </h3>
                                    <span className="px-3 py-1 rounded-full text-xs font-medium" style={getStatusStyles(staff.employeeStatus)}>
                                        {getStatusLabel(staff.employeeStatus)}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4" style={{ color: '#353330' }}>
                                    <p className="text-sm">
                                        <span className="font-medium">ID:</span> {staff.id}
                                    </p>
                                    {staff.campaignId && (
                                        <p className="text-sm">
                                            <span className="font-medium">Campaña ID:</span> {staff.campaignId}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-4 border-t" style={{ borderColor: '#e3e3d9' }}>
                                    <button
                                        onClick={() => navigate(`/staff/${staff.id}`)}
                                        className="flex-1 py-2 px-4 rounded-lg text-white font-medium transition hover:opacity-90"
                                        style={{ backgroundColor: '#99bb99' }}
                                    >
                                        Ver Detalles
                                    </button>
                                    <button
                                        onClick={() => navigate(`/staff/edit/${staff.id}`)}
                                        className="flex-1 py-2 px-4 rounded-lg text-white font-medium transition hover:opacity-90"
                                        style={{ backgroundColor: '#a29f8a' }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(staff.id, staff.name)}
                                        className="px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                                        style={{ backgroundColor: '#e57373' }}
                                    >
                                        Eliminar
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

export default Staffs;