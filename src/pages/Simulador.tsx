// src/pages/Simulador.tsx
import React from "react";
import { useSimulador } from "../hooks/useSimulador";
import { toast } from "react-toastify";

const Simulador: React.FC = () => {
  const {
    estado,
    isLoading,
    isError,
    iniciar,
    detener,
    isIniciando,
    isDeteniendo,
    refetchEstado,
  } = useSimulador();

  const handleIniciar = () => {
    iniciar(undefined, {
      onSuccess: () => {
        toast.success('Simulador iniciado correctamente');
      },
      onError: () => {
        toast.error('Error al iniciar el simulador');
      },
    });
  };

  const handleDetener = () => {
    detener(undefined, {
      onSuccess: () => {
        toast.success('Simulador detenido correctamente');
      },
      onError: () => {
        toast.error('Error al detener el simulador');
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Simulador de Dispositivos
            </h1>
            <p className="text-sm text-gray-500">
              Controla la simulación de datos en tiempo real
            </p>
          </div>
          
          {/* Estado del simulador */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  estado?.isRunning 
                    ? 'bg-green-500 animate-pulse' 
                    : 'bg-red-500'
                }`}
              />
              <span className={`text-sm font-medium ${
                estado?.isRunning ? 'text-green-600' : 'text-red-600'
              }`}>
                {estado?.isRunning ? 'Ejecutándose' : 'Detenido'}
              </span>
            </div>
            
            <button
              onClick={() => refetchEstado()}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              title="Actualizar estado"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de control */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Control del Simulador
            </h2>
            
            <div className="space-y-4">
              {/* Botón Iniciar */}
              <button
                onClick={handleIniciar}
                disabled={estado?.isRunning || isIniciando}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  estado?.isRunning || isIniciando
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isIniciando ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Iniciando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Iniciar Simulador</span>
                  </div>
                )}
              </button>

              {/* Botón Detener */}
              <button
                onClick={handleDetener}
                disabled={!estado?.isRunning || isDeteniendo}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ${
                  !estado?.isRunning || isDeteniendo
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isDeteniendo ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Deteniendo...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                    <span>Detener Simulador</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Estado del simulador */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Estado de la Simulación
            </h2>
            
            {isLoading ? (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ) : isError ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-gray-600">Error al cargar el estado del simulador</p>
                <button
                  onClick={() => refetchEstado()}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total de vehículos */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        Total de Vehículos
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {estado?.totalVehicles || 0}
                      </p>
                    </div>
                    <div className="text-2xl">🚗</div>
                  </div>
                </div>

                {/* Estado de ejecución */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">
                        Estado de Ejecución
                      </p>
                      <p className="text-lg font-bold text-green-900">
                        {estado?.isRunning ? 'Ejecutándose' : 'Detenido'}
                      </p>
                    </div>
                    <div className="text-2xl">
                      {estado?.isRunning ? '▶️' : '⏸️'}
                    </div>
                  </div>
                </div>

                {/* Lista de vehículos */}
                <div className="bg-purple-50 p-4 rounded-lg md:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-purple-600">
                      Vehículos Simulando
                    </p>
                    <div className="text-2xl">🚛</div>
                  </div>
                  <div className="space-y-2">
                    {estado?.vehicles?.length ? (
                      estado.vehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <div>
                              <p className="text-lg text-gray-500 font-bold">Dispositivo: {vehicle.id}</p>
                            </div>
                          </div>
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                            Activo
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">
                          No hay vehículos simulando
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulador;