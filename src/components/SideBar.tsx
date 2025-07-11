import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
  admin?: boolean;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { usuario, logout } = useAuth();

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Simulador',
      path: '/simulador',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      admin: true,
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col h-full bg-white shadow-lg">
      {/* Header del Sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Monitoreo IoT</h2>
          </div>
        </div>
      </div>

      {/* Menú de Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          if(item.admin && usuario?.rol !== 'admin'){
            return null;
          }
          return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
              isActive(item.path)
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </div>
            {item.badge && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
          )
        })}
      </nav>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-gray-200">
        {usuario ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{usuario.nombre}</p>
                <p className="text-xs text-gray-500">{usuario.correo}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-gray-500 hover:text-red-600 transition-colors duration-200"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            Iniciar Sesión
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;