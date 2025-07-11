
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Home: React.FC = () => {
  const { isAuthenticated, usuario } = useAuth();

  const stats = [
    { label: 'Dispositivos Activos', value: '12', change: '+2', changeType: 'positive' },
    { label: 'Temperatura Promedio', value: '24°C', change: '-1°C', changeType: 'negative' },
    { label: 'Humedad', value: '65%', change: '+3%', changeType: 'positive' },
    { label: 'Alertas Activas', value: '3', change: '-1', changeType: 'negative' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            {isAuthenticated 
              ? `¡Bienvenido de vuelta, ${usuario?.nombre}!`
              : 'Monitoreo IoT Web'
            }
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Sistema inteligente para el monitoreo y control de dispositivos IoT en tiempo real
          </p>
          {!isAuthenticated && (
            <Link
              to="/auth"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Iniciar Sesión
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {isAuthenticated && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex items-center text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <span>{stat.change}</span>
                  <svg className={`w-4 h-4 ml-1 ${
                    stat.changeType === 'positive' ? 'rotate-0' : 'rotate-180'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

     </div>
  );
};

export default Home;
