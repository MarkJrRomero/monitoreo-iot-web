// src/pages/Vehiculos.tsx
import React, { useState } from 'react';
import { useVehicles, useCreateVehicle, useUpdateVehicle, useDeleteVehicle } from '../hooks/useVehiculos';
import { useAuth } from '../hooks/useAuth';
import { maskDeviceId } from '../config/utils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

interface VehicleFormData {
  nombre: string;
  dispositivo_id: string;
  usuario_id?: number;
}

const Vehiculos: React.FC = () => {
  const { usuario } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [formData, setFormData] = useState<VehicleFormData>({
    nombre: '',
    dispositivo_id: '',
  });

  const { data: vehiclesData, isLoading } = useVehicles(page, 10, search);
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const deleteVehicle = useDeleteVehicle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVehicle) {
        await updateVehicle.mutateAsync({
          id: editingVehicle.id,
          vehicleData: formData
        });
        toast.success('Vehículo actualizado correctamente');
      } else {
        await createVehicle.mutateAsync(formData);
        toast.success('Vehículo creado correctamente');
      }
      
      setShowModal(false);
      setEditingVehicle(null);
      setFormData({ nombre: '', dispositivo_id: '' });
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar vehículo');
    }
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setFormData({
      nombre: vehicle.nombre,
      dispositivo_id: vehicle.dispositivo_id,
      usuario_id: vehicle.usuario_id,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar este vehículo?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteVehicle.mutateAsync(id);  
          toast.success('Vehículo eliminado correctamente');
        } catch (error: any) {
          toast.error(error.message || 'Error al eliminar vehículo');
        }
      }
    }); 
  };

  const handleCreate = () => {
    setEditingVehicle(null);
    setFormData({ nombre: '', dispositivo_id: '' });
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Vehículos</h1>
          <p className="text-gray-600">Administra los vehículos del sistema</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span>
          Nuevo Vehículo
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar vehículos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Dispositivo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propietario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehiclesData?.data.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{vehicle.nombre}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {usuario?.rol === 'admin' 
                      ? vehicle.dispositivo_id
                      : maskDeviceId(vehicle.dispositivo_id, usuario?.rol)
                    }
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vehicle.usuario_nombre || 'Sin asignar'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(vehicle)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vehiclesData?.pagination && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Mostrando {((page - 1) * 10) + 1} a {Math.min(page * 10, vehiclesData.pagination.total)} de {vehiclesData.pagination.total} resultados
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={!vehiclesData.pagination.hasPrev}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">
              Página {page} de {vehiclesData.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={!vehiclesData.pagination.hasNext}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              {editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ID Dispositivo
                </label>
                <input
                  type="text"
                  value={formData.dispositivo_id}
                  onChange={(e) => setFormData({...formData, dispositivo_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createVehicle.isPending || updateVehicle.isPending}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {createVehicle.isPending || updateVehicle.isPending ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehiculos;