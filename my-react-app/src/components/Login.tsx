import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input, Card, Image } from '@nextui-org/react';
import llogo from '../assets/llogo.png';

interface LoginProps {
  onLogin: (role: string, username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post<{ token: string; role: string }>(
        'http://192.168.0.16:5000/api/auth/login',
        { username, password }
      );

      // Guardar el token y el nombre de usuario en localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);

      // Llamar a la función onLogin con el rol y el nombre de usuario
      onLogin(response.data.role, username);
    } catch (error) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      style={{
        width: '100vw',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        padding: '20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        boxSizing: 'border-box'
      }}
    >
      <Image
        width={300}
        alt="Logo"
        src={llogo}
        style={{ marginBottom: '20px' }}
      />

      <Card
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxSizing: 'border-box'
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <Input
            variant="flat"
            width="100%"
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <Input
            variant="flat"
            label="Contraseña"
            type="password"
            width="100%"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <Button
            className='text-white'
          color='warning'
            type="submit"
            style={{ marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </Card>
  );
};

export default Login;
