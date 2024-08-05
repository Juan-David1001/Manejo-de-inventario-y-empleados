import React, { useState } from 'react';
import UserDataTable from "../components/Data-user";
import UsersTable from "../components/Tableuser";
import AppNavbar from '../components/navbar';
import AddUser from "../components/Adduser";
import { Button } from '@nextui-org/react';
import DeleteUser from '../components/Deleteuser';

function Admin() {
  const [isAddUserVisible, setIsAddUserVisible] = useState(false);

  const toggleAddUserVisibility = () => {
    setIsAddUserVisible(prevState => !prevState);
  };

  return (
    <div style={{ 
      height: '100vh', // Altura total del viewport
      width: '100vw',  // Ancho total del viewport
      overflow: 'hidden', // Oculta el desbordamiento fuera del contenedor principal
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <AppNavbar />
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', // Agrega la barra de desplazamiento vertical cuando sea necesario
        padding: '16px',  // Espacio alrededor del contenido
        boxSizing: 'border-box' // Asegura que el padding no afecte el ancho total
      }}>
        <UserDataTable />  
        <UsersTable />
        {isAddUserVisible && <AddUser />} {/* Condicionalmente renderiza AddUser */}
      </div>
      <Button  
        onClick={toggleAddUserVisibility} 
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {isAddUserVisible ? 'Cerrar' : 'Agregar Usuario'}
      </Button>
      <DeleteUser />
    </div>
  );
}

export default Admin;
