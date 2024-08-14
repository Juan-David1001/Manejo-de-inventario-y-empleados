import React, { useState } from 'react';
import axios from 'axios';

// Define un tipo para la respuesta del servidor (opcional)
interface ApiResponse {
  message?: string;
  error?: string;
}

const RegistrarSalida: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Función para manejar el click del botón
  const handleRegistroSalida = async () => {
    // Obtener el nombre de usuario desde localStorage
    const username = localStorage.getItem('username');

    if (!username) {
      setError('Nombre de usuario no encontrado en localStorage');
      return;
    }

    try {
      const response = await axios.post<ApiResponse>('http://192.168.0.16:5000/api/hora_salida', {
        username,
      });
      setStatusMessage(response.data.message || 'Salida registrada correctamente');
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError('Error desconocido');
      }
      setStatusMessage(null);
    }
  };

  return (
    <div>
      <button className='bg-secondary-300 rounded-2xl  '  onClick={handleRegistroSalida}>Registrar Salida</button>
      {statusMessage && <p>{statusMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default RegistrarSalida;
