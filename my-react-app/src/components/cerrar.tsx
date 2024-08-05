// src/components/Cerrar.tsx
import React from 'react';
import { Button } from '@nextui-org/react';

const Cerrar: React.FC = () => {
  const handleLogout = () => {
    // Limpiar el token y otros datos del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    
    // Recargar la página para redirigir al login
    window.location.reload();
  };

  return (
    <Button onClick={handleLogout} color="danger" variant="flat" className='text-white'>
      Cerrar session 
    </Button>
  );
};

export default Cerrar;
