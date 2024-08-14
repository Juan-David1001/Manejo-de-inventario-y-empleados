import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Snackbar, Alert } from '@mui/material';
import { FaPlus } from 'react-icons/fa';

const API_URL = 'http://192.168.0.16:5000/api/add-job-type';

const AddJobTypeForm: React.FC = () => {
    const [jobType, setJobType] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (jobType.trim() === '') {
            setError('Por favor, ingresa un tipo de trabajo.');
            setSuccess(null);
            setOpenSnackbar(true);
            return;
        }

        try {
            await axios.post(API_URL, { jobType });
            setSuccess('Tipo de trabajo añadido exitosamente.');
            setJobType(''); // Restablece el campo de entrada
            setError(null); // Limpia los errores previos
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error al añadir tipo de trabajo:', error);
            setError('No se pudo añadir el tipo de trabajo. Por favor, intenta de nuevo.');
            setSuccess(null);
            setOpenSnackbar(true);
        }
    };

    return (
        <Container
            sx={{
                margin: '40px auto',
                borderRadius: '16px',
                background: '#ffffff',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                height: 'auto',
                maxWidth: '500px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                color: '#333',
            }}
        >
            <Typography variant="h4" gutterBottom component="h1" align="center">
                Añadir un Tipo de Trabajo
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <TextField
                    label="Tipo de Trabajo"
                    variant="outlined"
                    fullWidth
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    margin="normal"
                    sx={{ mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ py: 1.5, fontSize: '16px' }}
                    endIcon={<FaPlus />}
                >
                    Añadir
                </Button>
            </form>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={success || error}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'}>
                    {success || error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddJobTypeForm;
