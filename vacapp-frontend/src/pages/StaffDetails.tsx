import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { staffApi, campaignsApi, type Staff, type Campaign, EmployeeStatus } from '../services/api';

const StaffDetails: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [staff, setStaff] = useState<Staff | null>(null);
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const s = await staffApi.getStaffById(Number(id));
                setStaff(s);
                if (s.campaignId) {
                    const c = await campaignsApi.getCampaignById(s.campaignId);
                    setCampaign(c);
                }
            } catch (err) {
                console.error('Error loading staff', err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f2f0e9' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#99bb99' }}></div>
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f2f0e9' }}>
                <div className="text-center">
                    <p className="text-xl mb-4" style={{ color: '#353330' }}>Personal no encontrado</p>
                    <button
                        onClick={() => navigate('/staff')}
                        className="px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: '#99bb99' }}
                    >
                        Volver a Personal
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f2f0e9' }}>
            <nav className="shadow-lg border-b sticky top-0 z-40" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/staff')}
                                className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition hover:opacity-80"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold" style={{ color: '#353330' }}>
                                Detalle del Personal
                            </h1>
                        </div>
                        <button
                            onClick={() => navigate(`/staff/edit/${staff.id}`)}
                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 hover:opacity-90"
                            style={{ backgroundColor: '#99bb99' }}
                        >
                            Editar
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl shadow-lg border p-6 mb-6" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: '#353330' }}>{staff.name}</h2>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {getStatusLabel(staff.employeeStatus)}
                    </span>
                </div>

                <div className="rounded-2xl shadow-lg border p-6" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                    <h3 className="text-xl font-bold mb-4" style={{ color: '#353330' }}>Campaña</h3>
                    {campaign ? (
                        <div className="space-y-1" style={{ color: '#353330' }}>
                            <p><strong>Nombre:</strong> {campaign.name}</p>
                            <p><strong>Estado:</strong> {campaign.status}</p>
                            <button
                                onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                className="mt-3 px-4 py-2 rounded-lg text-white"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                Ver campaña
                            </button>
                        </div>
                    ) : (
                        <p style={{ color: '#353330', opacity: 0.7 }}>Sin campaña asignada</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StaffDetails;


