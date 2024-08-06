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
            setError('Please provide both name and price.');
            return;
        }

        const payload: AddProductPayload = { name, price: Number(price) };

        try {
            if (product) {
                await axios.put(`${API_URL}/${product.id}`, payload);
                setSnackbarMessage('Product updated successfully.');
            } else {
                await axios.post(API_URL, payload);
                setSnackbarMessage('Product added successfully.');
                
            }
            setOpenSnackbar(true);
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            setSnackbarMessage('Failed to save product. Please try again.');
            setOpenSnackbar(true);
        }
    };

    return (
        <Container style={{
            backgroundColor:'white'
        }}>
            <Typography variant="h4" gutterBottom>
                {product ? 'Edit Product' : 'Add New Product'}
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
                            placeholder="Enter product name"
                            required
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
                            placeholder="Enter product price"
                            required
                        />
                    </Grid>
                    {error && (
                        <Grid item>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}
                    <Grid item>
                        <Button type="submit" variant="contained" color="primary">
                            {product ? 'Actualizar producto' : 'Añadir producto'}
                        </Button>
                        <Button type="button" variant="outlined" color="secondary" onClick={onClose} style={{ marginLeft: '10px' }}>
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
