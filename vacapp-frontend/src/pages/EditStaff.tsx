import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { staffApi, campaignsApi, type UpdateStaffRequest, type Campaign, EmployeeStatus } from '../services/api';

const EditStaff: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [formData, setFormData] = useState<UpdateStaffRequest>({
        name: '',
        employeeStatus: EmployeeStatus.Active,
        campaignId: null,
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [staffResp, campaignsResp] = await Promise.all([
                    staffApi.getStaffById(Number(id)),
                    campaignsApi.getAllCampaigns(),
                ]);
                setFormData({
                    name: staffResp.name,
                    employeeStatus: staffResp.employeeStatus,
                    campaignId: staffResp.campaignId,
                });
                setCampaigns(campaignsResp);
            } catch (err) {
                console.error('Error loading staff/campaigns', err);
                setError('No se pudo cargar la información');
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        setLoading(true);
        try {
            await staffApi.updateStaff(Number(id), formData);
            navigate(`/staff/${id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al actualizar el personal');
        } finally {
            setLoading(false);
        }
    };

    if (!id) return null;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f2f0e9' }}>
            <nav className="shadow-lg border-b sticky top-0 z-40" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(`/staff/${id}`)}
                                className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition hover:opacity-80"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold" style={{ color: '#353330' }}>
                                Editar Personal
                            </h1>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="rounded-2xl shadow-lg border p-6" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: '#353330' }}>Datos del Personal</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#353330' }}>Nombre *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                    placeholder="Nombre completo"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#353330' }}>Estado *</label>
                                <select
                                    value={formData.employeeStatus}
                                    onChange={(e) => setFormData({ ...formData, employeeStatus: Number(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                >
                                    <option value={EmployeeStatus.Active}>Activo</option>
                                    <option value={EmployeeStatus.Inactive}>Inactivo</option>
                                    <option value={EmployeeStatus.OnLeave}>De Licencia</option>
                                    <option value={EmployeeStatus.Retired}>Retirado</option>
                                    <option value={EmployeeStatus.Terminated}>Terminado</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#353330' }}>Campaña</label>
                                <select
                                    value={formData.campaignId ?? ''}
                                    onChange={(e) => setFormData({ ...formData, campaignId: e.target.value === '' ? null : Number(e.target.value) })}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                >
                                    <option value="">Sin campaña</option>
                                    {campaigns.map((c) => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/staff/${id}`)}
                            className="flex-1 py-3 px-4 rounded-lg font-medium transition hover:opacity-90"
                            style={{ backgroundColor: '#e3e3d9', color: '#353330' }}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: '#99bb99' }}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditStaff;


