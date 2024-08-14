import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Typography, MenuItem, FormControl, InputLabel, Select, Snackbar, Alert } from '@mui/material';

const API_URL_COLUMNS = 'http://192.168.0.16:5000/api/columns';
const API_URL_DELETE_COLUMN = 'http://192.168.0.16:5000/api/delete-column';

const DeleteColumnForm: React.FC = () => {
    const [columns, setColumns] = useState<string[]>([]);
    const [selectedColumn, setSelectedColumn] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        // Obtener nombres de columnas
        const fetchColumns = async () => {
            try {
                const response = await axios.get<string[]>(API_URL_COLUMNS);
                setColumns(response.data);
            } catch (error) {
                console.error('Error al obtener columnas:', error);
                setError('Error al obtener las columnas.');
                setOpenSnackbar(true);
            }
        };

        fetchColumns();
    }, []);

    const handleDelete = async () => {
        if (selectedColumn.trim() === '') {
            setError('Por favor, selecciona una columna para eliminar.');
            setSuccessMessage(null);
            setOpenSnackbar(true);
            return;
        }

        try {
            await axios.post(API_URL_DELETE_COLUMN, { columnName: selectedColumn });
            setSuccessMessage('Columna eliminada exitosamente.');
            setError(null);
            setOpenSnackbar(true);

            // Actualizar nombres de columnas después de la eliminación
            const response = await axios.get<string[]>(API_URL_COLUMNS);
            setColumns(response.data);
            setSelectedColumn('');
        } catch (error) {
            console.error('Error al eliminar columna:', error);
            setError('No se pudo eliminar la columna. Por favor, intenta de nuevo.');
            setSuccessMessage(null);
            setOpenSnackbar(true);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-lg text-black">
            <Typography variant="h4" gutterBottom component="h1" align="center">
                Borrar Columna
            </Typography>
            <FormControl fullWidth margin="normal">
                <InputLabel>Elige la columna a eliminar</InputLabel>
                <Select
                    value={selectedColumn}
                    onChange={(e) => setSelectedColumn(e.target.value as string)}
                    label="Nombre de Columna"
                >
                    {columns.map((column) => (
                        <MenuItem key={column} value={column}>
                            {column}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            {error && <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>}
            {successMessage && <Typography color="success.main" align="center" sx={{ mt: 2 }}>{successMessage}</Typography>}
            <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={handleDelete}
                sx={{ mt: 4, py: 1.5, fontSize: '16px' }}
            >
                Borrar
            </Button>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={successMessage || error}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'}>
                    {successMessage || error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default DeleteColumnForm;
