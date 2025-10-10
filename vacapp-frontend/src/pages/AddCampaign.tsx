import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignsApi, type CreateCampaignRequest, type Goal, type Channel } from '../services/api.ts';
import { stablesApi, type Stable } from '../services/api';

const AddCampaign: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [stables, setStables] = useState<Stable[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: 'Pending',
        stableId: undefined as number | undefined,
    });

    const [goals, setGoals] = useState<Omit<Goal, 'id' | 'campaignId'>[]>([]);
    const [channels, setChannels] = useState<Omit<Channel, 'id' | 'campaignId'>[]>([]);

    const [goalInput, setGoalInput] = useState({
        description: '',
        metric: '',
        targetValue: 0,
        currentValue: 0,
    });

    const [channelInput, setChannelInput] = useState({
        type: '',
        details: '',
    });

    useEffect(() => {
        fetchStables();
    }, []);

    const fetchStables = async () => {
        try {
            const data = await stablesApi.getAllStables();
            setStables(data);
        } catch (error) {
            console.error('Error fetching stables:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const campaignData: CreateCampaignRequest = {
                ...formData,
                goals,
                channels,
            };

            await campaignsApi.createCampaign(campaignData);
            navigate('/campaigns');
        } catch (error) {
            console.error('Error creating campaign:', error);
            alert('Error creating campaign. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const addGoal = () => {
        if (goalInput.description && goalInput.metric) {
            setGoals([...goals, { ...goalInput }]);
            setGoalInput({ description: '', metric: '', targetValue: 0, currentValue: 0 });
        }
    };

    const removeGoal = (index: number) => {
        setGoals(goals.filter((_, i) => i !== index));
    };

    const addChannel = () => {
        if (channelInput.type && channelInput.details) {
            setChannels([...channels, { ...channelInput }]);
            setChannelInput({ type: '', details: '' });
        }
    };

    const removeChannel = (index: number) => {
        setChannels(channels.filter((_, i) => i !== index));
    };

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
                                Create New Campaign
                            </h1>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="rounded-2xl shadow-lg border p-6" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: '#353330' }}>Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#353330' }}>
                                    Campaign Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                    placeholder="Enter campaign name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: '#353330' }}>
                                    Description *
                                </label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                    placeholder="Enter campaign description"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#353330' }}>
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                        style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#353330' }}>
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                        style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#353330' }}>
                                        Status *
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                        style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: '#353330' }}>
                                        Stable (Optional)
                                    </label>
                                    <select
                                        value={formData.stableId || ''}
                                        onChange={(e) => setFormData({ ...formData, stableId: e.target.value ? Number(e.target.value) : undefined })}
                                        className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                        style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                    >
                                        <option value="">No stable selected</option>
                                        {stables.map((stable) => (
                                            <option key={stable.id} value={stable.id}>
                                                {stable.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Goals Section */}
                    <div className="rounded-2xl shadow-lg border p-6" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: '#353330' }}>Goals</h2>

                        <div className="space-y-4 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Goal description"
                                    value={goalInput.description}
                                    onChange={(e) => setGoalInput({ ...goalInput, description: e.target.value })}
                                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                />
                                <input
                                    type="text"
                                    placeholder="Metric (e.g., Sales, Leads)"
                                    value={goalInput.metric}
                                    onChange={(e) => setGoalInput({ ...goalInput, metric: e.target.value })}
                                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="number"
                                    placeholder="Target value"
                                    value={goalInput.targetValue}
                                    onChange={(e) => setGoalInput({ ...goalInput, targetValue: Number(e.target.value) })}
                                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                />
                                <input
                                    type="number"
                                    placeholder="Current value"
                                    value={goalInput.currentValue}
                                    onChange={(e) => setGoalInput({ ...goalInput, currentValue: Number(e.target.value) })}
                                    className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                    style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={addGoal}
                                className="w-full py-2 px-4 rounded-lg text-white font-medium transition hover:opacity-90"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                Add Goal
                            </button>
                        </div>

                        {goals.length > 0 && (
                            <div className="space-y-2">
                                {goals.map((goal, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#e3e3d9' }}>
                                        <div>
                                            <p className="font-medium" style={{ color: '#353330' }}>{goal.description}</p>
                                            <p className="text-sm" style={{ color: '#353330', opacity: 0.7 }}>
                                                {goal.metric}: {goal.currentValue} / {goal.targetValue}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeGoal(index)}
                                            className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Channels Section */}
                    <div className="rounded-2xl shadow-lg border p-6" style={{ backgroundColor: '#f7f7f5', borderColor: '#e3e3d9' }}>
                        <h2 className="text-xl font-bold mb-4" style={{ color: '#353330' }}>Channels</h2>

                        <div className="space-y-4 mb-4">
                            <input
                                type="text"
                                placeholder="Channel type (e.g., Email, Social Media)"
                                value={channelInput.type}
                                onChange={(e) => setChannelInput({ ...channelInput, type: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                            />
                            <textarea
                                placeholder="Channel details"
                                value={channelInput.details}
                                onChange={(e) => setChannelInput({ ...channelInput, details: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                style={{ backgroundColor: '#f2f0e9', borderColor: '#e3e3d9', color: '#353330' }}
                            />
                            <button
                                type="button"
                                onClick={addChannel}
                                className="w-full py-2 px-4 rounded-lg text-white font-medium transition hover:opacity-90"
                                style={{ backgroundColor: '#99bb99' }}
                            >
                                Add Channel
                            </button>
                        </div>

                        {channels.length > 0 && (
                            <div className="space-y-2">
                                {channels.map((channel, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#e3e3d9' }}>
                                        <div>
                                            <p className="font-medium" style={{ color: '#353330' }}>{channel.type}</p>
                                            <p className="text-sm" style={{ color: '#353330', opacity: 0.7 }}>{channel.details}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeChannel(index)}
                                            className="px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/campaigns')}
                            className="flex-1 py-3 px-4 rounded-lg font-medium transition hover:opacity-90"
                            style={{ backgroundColor: '#e3e3d9', color: '#353330' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50"
                            style={{ backgroundColor: '#99bb99' }}
                        >
                            {loading ? 'Creating...' : 'Create Campaign'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default AddCampaign;