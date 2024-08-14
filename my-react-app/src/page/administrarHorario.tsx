import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AppNavbar from '../components/navbar';
// Define los tipos de datos basados en la estructura de las tablas
interface HoraSalida {
  id: number;
  nombre: string;
  hora_salida: string;
}

interface Llegada {
  id: number;
  nombre: string;
  fecha: string;
  hora_entrada: string;
}

const DatosTablas: React.FC = () => {
  const [horaSalida, setHoraSalida] = useState<HoraSalida[]>([]);
  const [llegada, setLlegada] = useState<Llegada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const horaSalidaResponse = await axios.get<HoraSalida[]>('http://192.168.0.16:5000/api/hora_salida');
        const llegadaResponse = await axios.get<Llegada[]>('http://192.168.0.16:5000/api/llegada');
        
        setHoraSalida(horaSalidaResponse.data);
        setLlegada(llegadaResponse.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError('Error desconocido');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="p-8 w-screen table-auto ">
      <AppNavbar/>
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Tabla de Llegada</h2>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold">Nombre</th>
              <th className="py-3 px-6 text-left text-sm font-semibold">Fecha</th>
              <th className="py-3 px-6 text-left text-sm font-semibold">Hora de Entrada</th>
            </tr>
          </thead>
          <tbody>
            {llegada.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors duration-300">
                <td className="py-4 px-6 text-sm text-gray-800">{item.nombre}</td>
                <td className="py-4 px-6 text-sm text-gray-800">{item.fecha}</td>
                <td className="py-4 px-6 text-sm text-gray-800">{item.hora_entrada}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla de Hora de Salida */}
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Tabla de Hora de Salida</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left text-sm font-semibold">ID</th>
              <th className="py-3 px-6 text-left text-sm font-semibold">Nombre</th>
              <th className="py-3 px-6 text-left text-sm font-semibold">Hora de Salida</th>
            </tr>
          </thead>
          <tbody>
            {horaSalida.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors duration-300">
                <td className="py-4 px-6 text-sm text-gray-800">{item.id}</td>
                <td className="py-4 px-6 text-sm text-gray-800">{item.nombre}</td>
                <td className="py-4 px-6 text-sm text-gray-800">{item.hora_salida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DatosTablas;
