import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignsApi } from '../services/api.ts';
import type { Campaign } from '../services/api';

const Campaigns: React.FC = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            setLoading(true);
            const data = await campaignsApi.getAllCampaigns();
            setCampaigns(data);
            setError(null);
        } catch (err) {
            setError('Error loading campaigns');
            console.error('Error fetching campaigns:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await campaignsApi.deleteCampaign(id);
            setCampaigns(campaigns.filter(c => c.id !== id));
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Error deleting campaign:', err);
            alert('Error deleting campaign');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return '#99bb99';
            case 'completed':
                return '#a29f8a';
            case 'pending':
                return '#e3e3d9';
            default:
                return '#353330';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f2f0e9' }}>
            {/* Navigation */}
            <nav className="shadow-lg border-b sticky top-0 z-40" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/home')}
                                className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition hover:opacity-80"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold" style={{ color: '#353330' }}>
                                Campaigns
                            </h1>
                        </div>
                        <button
                            onClick={() => navigate('/campaigns/add')}
                            className="text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 hover:opacity-90"
                            style={{ backgroundColor: '#99bb99' }}
                        >
                            + New Campaign
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#99bb99' }}></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchCampaigns}
                            className="mt-4 px-4 py-2 rounded-lg text-white"
                            style={{ backgroundColor: '#99bb99' }}
                        >
                            Try Again
                        </button>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#e3e3d9' }}>
                            <svg className="h-12 w-12" style={{ color: '#99bb99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: '#353330' }}>No Campaigns Yet</h3>
                        <p className="mb-4" style={{ color: '#353330', opacity: 0.7 }}>
                            Start creating campaigns to manage your marketing efforts.
                        </p>
                        <button
                            onClick={() => navigate('/campaigns/add')}
                            className="px-6 py-2 rounded-lg text-white font-medium"
                            style={{ backgroundColor: '#99bb99' }}
                        >
                            Create Your First Campaign
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map((campaign) => (
                            <div
                                key={campaign.id}
                                className="rounded-2xl shadow-lg border p-6 hover:shadow-xl transition duration-300"
                                style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-bold flex-1" style={{ color: '#353330' }}>
                                        {campaign.name}
                                    </h3>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                                        style={{ backgroundColor: getStatusColor(campaign.status) }}
                                    >
                                        {campaign.status}
                                    </span>
                                </div>

                                <p className="text-sm mb-4 line-clamp-2" style={{ color: '#353330', opacity: 0.7 }}>
                                    {campaign.description}
                                </p>

                                <div className="space-y-2 mb-4 text-sm" style={{ color: '#353330' }}>
                                    <div className="flex items-center space-x-2">
                                        <svg className="h-4 w-4" style={{ color: '#99bb99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <svg className="h-4 w-4" style={{ color: '#99bb99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                        <span>{campaign.goals?.length || 0} Goals</span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <svg className="h-4 w-4" style={{ color: '#99bb99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                        <span>{campaign.channels?.length || 0} Channels</span>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                        className="flex-1 py-2 px-4 rounded-lg text-white font-medium transition hover:opacity-90"
                                        style={{ backgroundColor: '#99bb99' }}
                                    >
                                        View Details
                                    </button>
                                    {deleteConfirm === campaign.id ? (
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleDelete(campaign.id)}
                                                className="px-3 py-2 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="px-3 py-2 rounded-lg font-medium"
                                                style={{ backgroundColor: '#e3e3d9', color: '#353330' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(campaign.id)}
                                            className="px-3 py-2 rounded-lg transition hover:opacity-90"
                                            style={{ backgroundColor: '#a29f8a' }}
                                        >
                                            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Campaigns;