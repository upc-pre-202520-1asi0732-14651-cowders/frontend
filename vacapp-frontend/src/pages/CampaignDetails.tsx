import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { campaignsApi, type Campaign, type AddGoalToCampaignRequest, type AddChannelToCampaignRequest } from '../services/api.ts';

const CampaignDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddGoal, setShowAddGoal] = useState(false);
    const [showAddChannel, setShowAddChannel] = useState(false);
    const [showUpdateStatus, setShowUpdateStatus] = useState(false);

    const [goalInput, setGoalInput] = useState<AddGoalToCampaignRequest>({
        description: '',
        metric: '',
        targetValue: 0,
        currentValue: 0,
    });

    const [channelInput, setChannelInput] = useState<AddChannelToCampaignRequest>({
        type: '',
        details: '',
    });

    const [newStatus, setNewStatus] = useState('');

    useEffect(() => {
        if (id) {
            fetchCampaign();
        }
    }, [id]);

    const fetchCampaign = async () => {
        try {
            setLoading(true);
            const data = await campaignsApi.getCampaignById(Number(id));
            setCampaign(data);
            setNewStatus(data.status);
        } catch (error) {
            console.error('Error fetching campaign:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGoal = async () => {
        if (!campaign || !goalInput.description || !goalInput.metric) return;

        try {
            const updated = await campaignsApi.addGoalToCampaign(campaign.id, goalInput);
            setCampaign(updated);
            setGoalInput({ description: '', metric: '', targetValue: 0, currentValue: 0 });
            setShowAddGoal(false);
        } catch (error) {
            console.error('Error adding goal:', error);
            alert('Error adding goal');
        }
    };

    const handleAddChannel = async () => {
        if (!campaign || !channelInput.type || !channelInput.details) return;

        try {
            const updated = await campaignsApi.addChannelToCampaign(campaign.id, channelInput);
            setCampaign(updated);
            setChannelInput({ type: '', details: '' });
            setShowAddChannel(false);
        } catch (error) {
            console.error('Error adding channel:', error);
            alert('Error adding channel');
        }
    };

    const handleUpdateStatus = async () => {
        if (!campaign) return;

        try {
            const updated = await campaignsApi.updateCampaignStatus(campaign.id, { status: newStatus });
            setCampaign(updated);
            setShowUpdateStatus(false);
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f2f0e9' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#99bb99' }}></div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f2f0e9' }}>
                <div className="text-center">
                    <p className="text-xl mb-4" style={{ color: '#353330' }}>Campaign not found</p>
                    <button
                        onClick={() => navigate('/campaigns')}
                        className="px-4 py-2 rounded-lg text-white"
                        style={{ backgroundColor: '#99bb99' }}
                    >
                        Back to Campaigns
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
                            <button
                                onClick={() => navigate('/campaigns')}
                                className="h-10 w-10 rounded-xl flex items-center justify-center shadow-lg transition hover:opacity-80"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <h1 className="text-2xl font-bold" style={{ color: '#353330' }}>
                                Campaign Details
                            </h1>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Campaign Header */}
                <div className="rounded-2xl shadow-lg border p-6 mb-6" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-2" style={{ color: '#353330' }}>{campaign.name}</h2>
                            <p className="text-lg" style={{ color: '#353330', opacity: 0.7 }}>{campaign.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span
                                className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                                style={{ backgroundColor: getStatusColor(campaign.status) }}
                            >
                                {campaign.status}
                            </span>
                            <button
                                onClick={() => setShowUpdateStatus(!showUpdateStatus)}
                                className="px-3 py-2 rounded-lg transition hover:opacity-90"
                                style={{ backgroundColor: '#a29f8a' }}
                            >
                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {showUpdateStatus && (
                        <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#e3e3d9' }}>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#353330' }}>
                                Update Status
                            </label>
                            <div className="flex space-x-2">
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="flex-1 px-4 py-2 rounded-lg border focus:outline-none"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#a29f8a', color: '#353330' }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Active">Active</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <button
                                    onClick={handleUpdateStatus}
                                    className="px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                                    style={{ backgroundColor: '#99bb99' }}
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => setShowUpdateStatus(false)}
                                    className="px-4 py-2 rounded-lg font-medium transition hover:opacity-90"
                                    style={{ backgroundColor: '#a29f8a', color: 'white' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center space-x-2" style={{ color: '#353330' }}>
                            <svg className="h-5 w-5" style={{ color: '#99bb99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span><strong>Start:</strong> {formatDate(campaign.startDate)}</span>
                        </div>
                        <div className="flex items-center space-x-2" style={{ color: '#353330' }}>
                            <svg className="h-5 w-5" style={{ color: '#99bb99' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span><strong>End:</strong> {formatDate(campaign.endDate)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Goals Section */}
                    <div className="rounded-2xl shadow-lg border p-6" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold" style={{ color: '#353330' }}>Goals</h3>
                            <button
                                onClick={() => setShowAddGoal(!showAddGoal)}
                                className="px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                + Add Goal
                            </button>
                        </div>

                        {showAddGoal && (
                            <div className="mb-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: '#e3e3d9' }}>
                                <input
                                    type="text"
                                    placeholder="Goal description"
                                    value={goalInput.description}
                                    onChange={(e) => setGoalInput({ ...goalInput, description: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#a29f8a', color: '#353330' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Metric"
                                    value={goalInput.metric}
                                    onChange={(e) => setGoalInput({ ...goalInput, metric: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#a29f8a', color: '#353330' }}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Target"
                                        value={goalInput.targetValue}
                                        onChange={(e) => setGoalInput({ ...goalInput, targetValue: Number(e.target.value) })}
                                        className="px-4 py-2 rounded-lg border focus:outline-none"
                                        style={{ backgroundColor: '#f2f0e9', borderColor: '#a29f8a', color: '#353330' }}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Current"
                                        value={goalInput.currentValue}
                                        onChange={(e) => setGoalInput({ ...goalInput, currentValue: Number(e.target.value) })}
                                        className="px-4 py-2 rounded-lg border focus:outline-none"
                                        style={{ backgroundColor: '#f2f0e9', borderColor: '#a29f8a', color: '#353330' }}
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleAddGoal}
                                        className="flex-1 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                                        style={{ backgroundColor: '#99bb99' }}
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setShowAddGoal(false)}
                                        className="flex-1 py-2 rounded-lg font-medium transition hover:opacity-90"
                                        style={{ backgroundColor: '#a29f8a', color: 'white' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {campaign.goals && campaign.goals.length > 0 ? (
                                campaign.goals.map((goal) => (
                                    <div key={goal.id} className="p-4 rounded-lg" style={{ backgroundColor: '#e3e3d9' }}>
                                        <h4 className="font-semibold mb-2" style={{ color: '#353330' }}>{goal.description}</h4>
                                        <p className="text-sm mb-2" style={{ color: '#353330', opacity: 0.7 }}>
                                            Metric: {goal.metric}
                                        </p>
                                        <div className="w-full bg-white rounded-full h-4 overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-300"
                                                style={{
                                                    backgroundColor: '#99bb99',
                                                    width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%`
                                                }}
                                            />
                                        </div>
                                        <p className="text-sm mt-1 text-right" style={{ color: '#353330' }}>
                                            {goal.currentValue} / {goal.targetValue}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-4" style={{ color: '#353330', opacity: 0.6 }}>
                                    No goals added yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Channels Section */}
                    <div className="rounded-2xl shadow-lg border p-6" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold" style={{ color: '#353330' }}>Channels</h3>
                            <button
                                onClick={() => setShowAddChannel(!showAddChannel)}
                                className="px-4 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                + Add Channel
                            </button>
                        </div>

                        {showAddChannel && (
                            <div className="mb-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: '#e3e3d9' }}>
                                <input
                                    type="text"
                                    placeholder="Channel type (e.g., Email, Social Media)"
                                    value={channelInput.type}
                                    onChange={(e) => setChannelInput({ ...channelInput, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#a29f8a', color: '#353330' }}
                                />
                                <textarea
                                    placeholder="Channel details"
                                    value={channelInput.details}
                                    onChange={(e) => setChannelInput({ ...channelInput, details: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#a29f8a', color: '#353330' }}
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleAddChannel}
                                        className="flex-1 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
                                        style={{ backgroundColor: '#99bb99' }}
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => setShowAddChannel(false)}
                                        className="flex-1 py-2 rounded-lg font-medium transition hover:opacity-90"
                                        style={{ backgroundColor: '#a29f8a', color: 'white' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3">
                            {campaign.channels && campaign.channels.length > 0 ? (
                                campaign.channels.map((channel) => (
                                    <div key={channel.id} className="p-4 rounded-lg" style={{ backgroundColor: '#e3e3d9' }}>
                                        <div className="flex items-start space-x-3">
                                            <div className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#99bb99' }}>
                                                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold mb-1" style={{ color: '#353330' }}>{channel.type}</h4>
                                                <p className="text-sm" style={{ color: '#353330', opacity: 0.7 }}>{channel.details}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-4" style={{ color: '#353330', opacity: 0.6 }}>
                                    No channels added yet
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CampaignDetails;