import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Bovines from './pages/Bovines';
import AddBovine from './pages/AddBovine';
import BovineDetails from './pages/BovineDetails';
import EditBovine from './pages/EditBovine';
import Stables from './pages/Stables';
import AddStable from './pages/AddStable';
import StableDetails from './pages/StableDetails';
import EditStable from './pages/EditStable';
import Vaccines from './pages/Vaccines';
import AddVaccine from './pages/AddVaccine';
import VaccineDetails from './pages/VaccineDetails';
import EditVaccine from './pages/EditVaccine';
import Settings from './pages/Settings';
import Campaigns from './pages/Campaigns';
import AddCampaign from './pages/AddCampaign';
import CampaignDetails from './pages/CampaignDetails';
import './App.css';
import VoiceCommandComponent from "./components/VoiceCommandComponent.tsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bovines"
                            element={
                                <ProtectedRoute>
                                    <Bovines />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bovines/add"
                            element={
                                <ProtectedRoute>
                                    <AddBovine />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bovines/:id"
                            element={
                                <ProtectedRoute>
                                    <BovineDetails />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bovines/:id/edit"
                            element={
                                <ProtectedRoute>
                                    <EditBovine />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/stables"
                            element={
                                <ProtectedRoute>
                                    <Stables />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/stables/add"
                            element={
                                <ProtectedRoute>
                                    <AddStable />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/stables/:id"
                            element={
                                <ProtectedRoute>
                                    <StableDetails />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/stables/:id/edit"
                            element={
                                <ProtectedRoute>
                                    <EditStable />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/vaccines"
                            element={
                                <ProtectedRoute>
                                    <Vaccines />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/vaccines/add"
                            element={
                                <ProtectedRoute>
                                    <AddVaccine />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/vaccines/:id"
                            element={
                                <ProtectedRoute>
                                    <VaccineDetails />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/vaccines/:id/edit"
                            element={
                                <ProtectedRoute>
                                    <EditVaccine />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/campaigns"
                            element={
                                <ProtectedRoute>
                                    <Campaigns />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/campaigns/add"
                            element={
                                <ProtectedRoute>
                                    <AddCampaign />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/campaigns/:id"
                            element={
                                <ProtectedRoute>
                                    <CampaignDetails />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <Settings />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/home" replace />} />
                    </Routes>
                </div>
                {/* Voice Command Component */}
                <VoiceCommandComponent />
            </Router>
        </AuthProvider>
    );
}

export default App;