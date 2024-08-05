import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Button, Alert } from '@mui/material';

const DeleteUser: React.FC = () => {
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Obtener la lista de usuarios al montar el componente
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://192.168.0.16:5000/api/users');
        setUsers(response.data.map((user: { username: string }) => user.username));
      } catch (error) {
        setError('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!selectedUser) {
      setError('No user selected');
      return;
    }

    try {
      await axios.delete(`http://192.168.0.16:5000/api/users/${selectedUser}`);
      alert('User deleted successfully');
      setSelectedUser(null);
      // Actualizar la lista de usuarios después de eliminar
      const response = await axios.get('http://192.168.0.16:5000/api/users');
      setUsers(response.data.map((user: { username: string }) => user.username));
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ padding: 3, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Delete User
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="user-select-label">Select User to Delete</InputLabel>
        <Select
          labelId="user-select-label"
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(e.target.value)}
          label="Select User to Delete"
        >
          <MenuItem value=""><em>Select a user</em></MenuItem>
          {users.map((user) => (
            <MenuItem key={user} value={user}>
              {user}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDeleteUser}
        fullWidth
        sx={{ mt: 2 }}
      >
        Delete User
      </Button>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Container>
  );
};

export default DeleteUser;
