import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const API_URL_USER_DATA = 'http://192.168.0.16:5000/api/user-data'; // Cambia esta URL por la de tu API

const AddUserDataForm: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
    const [userId, setUserId] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [columns, setColumns] = useState<string[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [newData, setNewData] = useState<any>({});

    useEffect(() => {
        const fetchUserData = async () => {
            const username = localStorage.getItem("username");
            if (!username) return;
            try {
                const response = await axios.get(`${API_URL_USER_DATA}?username=${username}`);
                setColumns(response.data.columns);
                setUserId(response.data.data[0]?.user_id || ''); // Ajusta según tu respuesta
                setName(response.data.data[0]?.nombre || ''); // Ajusta según tu respuesta
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewData({ ...newData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await axios.post(API_URL_USER_DATA, {
                user_id: userId,
                nombre: name,
                ...newData
            });
            onSuccess(); // Notifica al componente padre del éxito
            onClose(); // Cierra el diálogo
        } catch (error) {
            console.error('Error adding user data:', error);
        }
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Add New User Data</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="User ID"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={userId}
                    disabled
                />
                <TextField
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={name}
                    disabled
                />
                {columns.map(column => (
                    <TextField
                        key={column}
                        margin="dense"
                        label={column}
                        type="text"
                        fullWidth
                        variant="outlined"
                        name={column}
                        onChange={handleChange}
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Cancelar</Button>
                <Button onClick={handleSubmit} color="primary">Añadir</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddUserDataForm;
