// src/pages/Ingesta.tsx
import React, { useState } from 'react';
import { useIngesta } from '../hooks/useIngesta';
import { useVehicles } from '../hooks/useVehiculos';
import { useAuth } from '../hooks/useAuth';
import { maskDeviceId } from '../config/utils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SensorFormData {
  vehiculo_id: string;
  gps: string;
  combustible: number;
  temperatura: number;
  velocidad: number;
  latitud: number;
  longitud: number;
}

const Ingesta: React.FC = () => {
  const { usuario } = useAuth();
  const { data: vehiclesData } = useVehicles(1, 100); // Obtener todos los vehículos
  const ingesta = useIngesta();

  const [formData, setFormData] = useState<SensorFormData>({
    vehiculo_id: '',
    gps: '',
    combustible: 50,
    temperatura: 25,
    velocidad: 0,
    latitud: 6.25184,
    longitud: -75.56359,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await ingesta.mutateAsync(formData);
      toast.success('Datos de sensores enviados correctamente');
      
      // Limpiar formulario después del envío exitoso
      setFormData({
        vehiculo_id: '',
        gps: '',
        combustible: 50,
        temperatura: 25,
        velocidad: 0,
        latitud: 6.25184,
        longitud: -75.56359,
      });
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar datos de sensores');
    }
  };

  const handleRandomData = () => {
    const randomCombustible = Math.floor(Math.random() * 100);
    const randomTemperatura = Math.floor(Math.random() * 50) + 20;
    const randomVelocidad = Math.floor(Math.random() * 120);
    const randomLat = 6.25184 + (Math.random() - 0.5) * 0.1;
    const randomLng = -75.56359 + (Math.random() - 0.5) * 0.1;

    setFormData(prev => ({
      ...prev,
      combustible: randomCombustible,
      temperatura: randomTemperatura,
      velocidad: randomVelocidad,
      latitud: randomLat,
      longitud: randomLng,
      gps: `GPS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Ingesta de Datos de Sensores
          </h1>
          <p className="text-gray-600">
            Envía datos de sensores a un vehículo específico
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehículo *
              </label>
              <select
                value={formData.vehiculo_id}
                onChange={(e) => setFormData({...formData, vehiculo_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecciona un vehículo</option>
                {vehiclesData?.data.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.dispositivo_id}>
                    {vehicle.nombre} - {usuario?.rol === 'admin' 
                      ? vehicle.dispositivo_id
                      : maskDeviceId(vehicle.dispositivo_id, usuario?.rol)
                    }
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPS
              </label>
              <input
                type="text"
                value={formData.gps}
                onChange={(e) => setFormData({...formData, gps: e.target.value})}
                placeholder="ABC123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Combustible (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.combustible}
                  onChange={(e) => setFormData({...formData, combustible: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperatura}
                  onChange={(e) => setFormData({...formData, temperatura: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Velocidad (km/h)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.velocidad}
                  onChange={(e) => setFormData({...formData, velocidad: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitud
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitud}
                  onChange={(e) => setFormData({...formData, latitud: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitud
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitud}
                  onChange={(e) => setFormData({...formData, longitud: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleRandomData}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Generar Datos Aleatorios
              </button>
              <button
                type="submit"
                disabled={ingesta.isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {ingesta.isPending ? 'Enviando...' : 'Enviar Datos'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Información
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Los datos se enviarán al WebSocket en tiempo real</li>
            <li>• Se pueden generar alertas automáticas según los valores</li>
            <li>• La velocidad debe estar en km/h</li>
            <li>• La temperatura debe estar en grados Celsius</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Ingesta;
