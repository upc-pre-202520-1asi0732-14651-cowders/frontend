import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import type { SignUpRequest } from '../services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<SignUpRequest>({
    username: '',
    password: '',
    email: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSaasAgreement, setShowSaasAgreement] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (formData.password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔵 handleSubmit called');
    setError('');

    if (!validateForm()) {
      console.log('❌ Validation failed');
      return;
    }

    console.log('✅ Validation passed, showing SaaS agreement');
    setShowSaasAgreement(true);
  };

  const handleAcceptAgreement = async () => {
    console.log('🟢 User accepted agreement, starting registration');
    setIsLoading(true);

    try {
      console.log('📤 Calling API signUp...');
      const response = await authApi.signUp(formData);
      console.log('✅ Registration successful:', response);

      setShowSaasAgreement(false);
      setShowSuccessMessage(true);

      console.log('⏳ Waiting 2 seconds before redirect...');
      setTimeout(() => {
        console.log('🔐 Logging in and redirecting to home...');
        login(response);
        navigate('/home');
      }, 2000);
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      setShowSaasAgreement(false);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineAgreement = () => {
    console.log('🔴 User declined agreement');
    setShowSaasAgreement(false);
  };

  console.log('🎨 Render - showSaasAgreement:', showSaasAgreement, 'showSuccessMessage:', showSuccessMessage);

  return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-300 to-indigo-300 rounded-full opacity-10 animate-pulse"></div>
        </div>

        {/* MODAL DEL ACUERDO SAAS */}
        {showSaasAgreement && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-2xl">
                  <h3 className="text-2xl font-bold text-white">Acuerdo de Servicio SaaS - Moobile</h3>
                  <button
                      onClick={handleDeclineAgreement}
                      className="text-white hover:text-gray-200 transition-colors"
                      disabled={isLoading}
                      type="button"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
                    <p className="text-sm leading-relaxed">
                      El presente Acuerdo de Servicio SaaS ("Acuerdo") se celebra entre <strong>Moobile S.A.C.</strong>, en adelante "Moobile", proveedor de la plataforma digital y titular de todos los derechos asociados, y el Usuario, entendido como toda persona natural o jurídica que acceda o utilice los servicios ofrecidos por Moobile.
                    </p>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">1. Aceptación del Acuerdo</h4>
                    <p className="text-sm leading-relaxed">
                      El Usuario declara haber leído, comprendido y aceptado todos los términos del presente Acuerdo. El uso continuado del Servicio implicará la aceptación plena y voluntaria de estas condiciones.
                    </p>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">2. Definiciones</h4>
                    <p className="text-sm leading-relaxed">
                      <strong>Plataforma:</strong> El sistema digital desarrollado y administrado por Moobile que permite gestionar información veterinaria, historial de animales, citas, tratamientos, reportes y otros servicios relacionados.
                    </p>
                    <p className="text-sm leading-relaxed">
                      <strong>Usuario:</strong> Persona natural o jurídica que accede a los servicios SaaS de Moobile.
                    </p>
                    <p className="text-sm leading-relaxed">
                      <strong>Servicio:</strong> El acceso en línea a las funcionalidades de Moobile, bajo modalidad de Software como Servicio.
                    </p>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">3. Objeto del Acuerdo</h4>
                    <p className="text-sm leading-relaxed">
                      El presente Acuerdo tiene por objeto establecer los términos y condiciones bajo los cuales Moobile otorga al Usuario una licencia limitada, no exclusiva, intransferible y revocable para utilizar la Plataforma, conforme a los fines previstos y de acuerdo con las disposiciones aquí establecidas.
                    </p>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">4. Acceso y Uso del Servicio</h4>
                    <p className="text-sm leading-relaxed">
                      El Usuario podrá acceder al Servicio mediante la creación de una cuenta personal o corporativa. El Usuario se compromete a proporcionar información veraz, completa y actualizada.
                    </p>
                    <p className="text-sm leading-relaxed font-semibold">El Usuario no podrá:</p>
                    <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                      <li>Copiar, modificar o distribuir el software sin autorización.</li>
                      <li>Utilizar la Plataforma con fines ilícitos, fraudulentos o contrarios a la moral y buenas costumbres.</li>
                      <li>Intentar descompilar o realizar ingeniería inversa sobre el software.</li>
                    </ul>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">5. Propiedad Intelectual</h4>
                    <p className="text-sm leading-relaxed">
                      Todos los derechos de propiedad intelectual sobre la Plataforma, su código fuente, diseño, logotipos, marcas, bases de datos y documentación son propiedad exclusiva de Moobile S.A.C. El Usuario no adquiere derecho alguno sobre dichos elementos, salvo el uso limitado otorgado por este Acuerdo.
                    </p>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">6. Confidencialidad y Protección de Datos</h4>
                    <p className="text-sm leading-relaxed">
                      Moobile garantiza que los Datos del Usuario serán tratados con estricta confidencialidad y conforme a la <strong>Ley N.º 29733 – Ley de Protección de Datos Personales del Perú</strong>, su Reglamento y normas complementarias.
                    </p>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">7. Exclusión de Intermediación Financiera</h4>
                    <p className="text-sm leading-relaxed">
                      Moobile no gestiona ni intermedia pagos entre los Usuarios ni entre terceros. Cualquier transacción económica que pudiera derivarse del uso de la Plataforma es responsabilidad exclusiva de las partes involucradas.
                    </p>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">8. Disponibilidad y Mantenimiento del Servicio</h4>
                    <p className="text-sm leading-relaxed">
                      Moobile se compromete a mantener una disponibilidad mínima del 99% mensual del Servicio, salvo interrupciones planificadas por mantenimiento o causas de fuerza mayor.
                    </p>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">9. Limitación de Responsabilidad</h4>
                    <p className="text-sm leading-relaxed">
                      Moobile no será responsable por daños indirectos, pérdida de datos o lucro cesante derivados del uso o imposibilidad de uso del Servicio, fallos ocasionados por la red de internet, proveedores externos o configuraciones del dispositivo del Usuario.
                    </p>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">10. Modificaciones al Acuerdo</h4>
                    <p className="text-sm leading-relaxed">
                      Moobile se reserva el derecho de modificar, actualizar o complementar los términos del presente Acuerdo en cualquier momento. Las modificaciones serán publicadas en la Plataforma o notificadas al Usuario por medios electrónicos.
                    </p>

                    <h4 className="text-lg font-bold text-gray-900 mt-4">11. Ley Aplicable y Jurisdicción</h4>
                    <p className="text-sm leading-relaxed">
                      El presente Acuerdo se rige por las leyes de la República del Perú. Cualquier controversia derivada del mismo será resuelta ante los tribunales competentes de Lima, Perú.
                    </p>

                    <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-300 rounded-lg">
                      <p className="text-sm font-semibold text-purple-900">
                        Al hacer clic en "Acepto", confirmo que he leído y acepto los términos del Acuerdo de Servicio de Moobile.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex space-x-4 bg-gray-50 rounded-b-2xl">
                  <button
                      onClick={handleDeclineAgreement}
                      disabled={isLoading}
                      type="button"
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition duration-200 disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                  <button
                      onClick={handleAcceptAgreement}
                      disabled={isLoading}
                      type="button"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Procesando...
                        </>
                    ) : (
                        'Acepto'
                    )}
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* MODAL DE ÉXITO */}
        {showSuccessMessage && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 animate-bounce">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h3>
                <p className="text-gray-600 mb-4">
                  Tu cuenta ha sido creada exitosamente. Serás redirigido a tu dashboard en un momento.
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              </div>
            </div>
        )}

        <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo and branding */}
          <div className="text-center mb-8">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Moobile</h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 backdrop-blur-sm bg-white/80 border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
              )}

              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Choose a username"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Create a password"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters long</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 bg-gray-50/50 hover:bg-white"
                      placeholder="Confirm your password"
                  />
                </div>
              </div>

              <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  <div className="flex items-center">
                    <span>Create account</span>
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                      to="/login"
                      className="font-semibold text-purple-600 hover:text-purple-500 transition duration-200"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
};

export default Register;