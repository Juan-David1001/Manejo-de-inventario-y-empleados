import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {  Button, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

const API_URL_COLUMNS = 'http://192.168.0.16:5000/api/columns';
const API_URL_DELETE_COLUMN = 'http://192.168.0.16:5000/api/delete-column';

const DeleteColumnFormm: React.FC = () => {
    const [columns, setColumns] = useState<string[]>([]);
    const [selectedColumn, setSelectedColumn] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        // Fetch column names
        const fetchColumns = async () => {
            try {
                const response = await axios.get<string[]>(API_URL_COLUMNS);
                setColumns(response.data);
            } catch (error) {
                console.error('Error fetching columns:', error);
                setError('Failed to fetch columns');
            }
        };

        fetchColumns();
    }, []);

    const handleDelete = async () => {
        if (selectedColumn.trim() === '') {
            setError('Please select a column to delete');
            return;
        }

        try {
            await axios.post(API_URL_DELETE_COLUMN, { columnName: selectedColumn });
            setSuccessMessage('Column deleted successfully');
            setError(null);
            // Refresh column names after deletion
            const response = await axios.get<string[]>(API_URL_COLUMNS);
            setColumns(response.data);
            setSelectedColumn('');
        } catch (error) {
            console.error('Error deleting column:', error);
            setError('Failed to delete column. Please try again.');
            setSuccessMessage(null);
        }
    };

    return (
        <div style={{   
            margin:  '40px', borderRadius: '50px',
            background: 'white',
            boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
                height: '50vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                color: '#333',}}>
            <Typography variant="h3">Borrar trabajo</Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel>Elige el valor a eliminar</InputLabel>
                <Select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value as string)}
                    label="Column Name"
                >
                    {columns.map((column) => (
                        <MenuItem key={column} value={column}>
                            {column}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {error && <Typography color="error">{error}</Typography>}
            {successMessage && <Typography color="success">{successMessage}</Typography>}
            <Button variant="contained" color="primary" onClick={handleDelete}>
                Borrar
            </Button>
        </div>
    );
};

export default DeleteColumnFormm;
