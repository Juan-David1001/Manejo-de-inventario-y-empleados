import  { useState } from 'react';
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
      flexDirection: 'column' ,
      justifyContent:'center',
      alignItems:'center',
    }}>
      <AppNavbar />
      
      <div className="flex-1 overflow-y-auto p-4 w-full mt-11">
     
      <h2 className="text-3xl font-bold mb-6 text-gray-900">Tabla de Registros</h2>
        <UserDataTable />  
        <br></br>
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Tabla de Usuarios</h2>
        <UsersTable />
        {isAddUserVisible && <AddUser />} {/* Condicionalmente renderiza AddUser */}
      </div>
      <Button  
        onClick={toggleAddUserVisibility} 
        style={{
         
          bottom: '16px',
          right: '16px',
          padding: '8px 16px',
          backgroundColor: 'ButtonShadow',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          width: 'fit-content',

        }}
      >
        {isAddUserVisible ? 'Cerrar' : 'Agregar Usuario'}
      </Button>
      <DeleteUser />
    </div>
  );
}

export default Admin;
