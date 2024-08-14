import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Product, AddProductPayload } from '../types/types';
import { TextField, Button, Typography, Container, Grid, Snackbar, Alert } from '@mui/material';

const API_URL = 'http://192.168.0.16:5000/api/products';

interface ProductFormProps {
    product: Product | null;
    onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number | ''>('');
    const [error, setError] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
        } else {
            setName('');
            setPrice('');
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (name.trim() === '' || price === '') {
            setError('Por favor, proporciona tanto el nombre como el precio.');
            setOpenSnackbar(true);
            return;
        }

        const payload: AddProductPayload = { name, price: Number(price) };

        try {
            if (product) {
                await axios.put(`${API_URL}/${product.id}`, payload);
                setSnackbarMessage('Producto actualizado con éxito.');
            } else {
                await axios.post(API_URL, payload);
                setSnackbarMessage('Producto añadido con éxito.');
            }
            setError(null);
            setOpenSnackbar(true);
            onClose();
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            setSnackbarMessage('No se pudo guardar el producto. Por favor, intenta de nuevo.');
            setError(null);
            setOpenSnackbar(true);
        }
    };

    return (
        <Container
            sx={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                maxWidth: '600px',
                margin: 'auto',
                mt: 4,
            }}
        >
            <Typography variant="h4" gutterBottom align="center">
                {product ? 'Editar Producto' : 'Añadir Nuevo Producto'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <TextField
                            label="Nombre"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            placeholder="Ingresa el nombre del producto"
                            required
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Precio"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={price === '' ? '' : price}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Ingresa el precio del producto"
                            required
                            sx={{ mb: 2 }}
                        />
                    </Grid>
                    {error && (
                        <Grid item>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}
                    <Grid item>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ py: 1.5, fontSize: '16px' }}
                        >
                            {product ? 'Actualizar Producto' : 'Añadir Producto'}
                        </Button>
                        <Button
                            type="button"
                            variant="outlined"
                            color="secondary"
                            onClick={onClose}
                            sx={{ mt: 2, ml: 1.5 }}
                        >
                            Cancelar
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={error ? 'error' : 'success'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ProductForm;
