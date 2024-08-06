import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { Button, Input, Card} from '@nextui-org/react';
import { Select, SelectItem } from '@nextui-org/react';


const AddUser: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('admin'); // Valor por defecto
  const [error, setError] = useState<string>('');

  const handleAddUser = async (e: FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiar errores anteriores

    try {
      // Crear el usuario
      await axios.post('http://192.168.0.16:5000/api/users', { username, password, role });
      alert('User created successfully');
      
      // Obtener ID de usuario (asumido como la respuesta del backend en la ruta '/api/users')
       // Fecha actual en formato ISO

      // Guardar datos adicionales del usuario
      /*await axios.post('http://192.168.0.16:5000/api/user-data', { userId, nombre, velas, papel, fecha });
      alert('User data saved successfully');*/

      // Limpiar campos después de la creación
      setUsername('');
      setPassword('');
      setRole('admin');
    } catch (error) {
      setError('Failed to create user');
    }
  };

  return (
    <Card 
      style={{ 
        width: '100vw', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh', 
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
      }}
    >
     
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Añadir Usuario</p>
      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Input
            variant={'flat'}
            width={'100%'}
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            variant={'flat'}
            label="Password"
            type="password"
            width={'100%'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="role">Role</label>
          <Select
            label="Role"
            placeholder="Select a role"
            selectedKeys={[role]}  // To handle the selected option
            onSelectionChange={(keys) => {
              for (const key of keys) {
                setRole(key.toString()); // Convert to string before updating state
                break; // Exit loop after getting the first key (single selection)
              }
            }}
            className="max-w-xs" 
          >
            <SelectItem key="admin" value="admin">
              Administrator
            </SelectItem>
            <SelectItem key="employee" value="employee">
              Empleado
            </SelectItem>
          </Select>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button type="submit" style={{ marginTop: '10px' }}>Añadir Usuario</Button>
        </form>
      </Card>
      
    </Card>
    
  );
};

export default AddUser;
