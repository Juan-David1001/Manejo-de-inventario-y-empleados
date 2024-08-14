import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Product, InventoryItem } from '../types/types';
import { TextField, Typography, Grid, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, useMediaQuery, useTheme } from '@mui/material';
import { Button, Card } from '@mui/material';
import { FaSave, FaTimes } from 'react-icons/fa';

const API_URL_PRODUCTS = 'http://192.168.0.16:5000/api/products';
const API_URL_INVENTORY = 'http://192.168.0.16:5000/api/inventory';

interface InventoryFormProps {
    product: Product | null;
    inventoryItem?: InventoryItem | null; // Hacer opcional inventoryItem
    onClose: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ product, inventoryItem, onClose }) => {
    const [selectedProductId, setSelectedProductId] = useState<number | ''>(product?.id || '');
    const [quantity, setQuantity] = useState<number | ''>(inventoryItem?.quantity || '');
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (product) {
            setSelectedProductId(product.id);
        } else {
            setSelectedProductId('');
        }

        if (inventoryItem) {
            setSelectedProductId(inventoryItem.product_id);
            setQuantity(inventoryItem.quantity);
        }
    }, [product, inventoryItem]);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>(API_URL_PRODUCTS);
            setProducts(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedProductId === '' || quantity === '' || quantity <= 0) {
            setError('Por favor, proporciona un producto válido y una cantidad.');
            return;
        }

        const payload = { product_id: Number(selectedProductId), quantity: Number(quantity) };

        try {
            if (inventoryItem) {
                // Actualizar ítem de inventario existente
                await axios.put(`${API_URL_INVENTORY}/${inventoryItem.id}`, payload);
                setSnackbarMessage('Ítem de inventario actualizado correctamente.');
            } else {
                // Añadir nuevo ítem de inventario
                await axios.post(API_URL_INVENTORY, payload);
                setSnackbarMessage('Ítem de inventario añadido correctamente.');
            }
            setOpenSnackbar(true);
            onClose();
        } catch (error) {
            console.error('Error al guardar el ítem de inventario:', error);
            setSnackbarMessage('No se pudo guardar el ítem de inventario. Inténtalo de nuevo.');
            setOpenSnackbar(true);
        }
    };

    const handleProductChange = (event: SelectChangeEvent<number>) => {
        setSelectedProductId(event.target.value as number);
    };

    return (
        <Card 
            sx={{
                backgroundColor: '#f5f5f5',
                width: isSmallScreen ? '90vw' : '40vw',
                padding: '20px',
                margin: 'auto',
                marginTop: isSmallScreen ? '20px' : '0',
                boxShadow: 3,
                borderRadius: '8px',
            }}
        >
            <Typography variant="h5" gutterBottom>
                {inventoryItem ? 'Editar ítem de inventario' : 'Añadir ítem de inventario'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <FormControl fullWidth>
                            <InputLabel>Producto</InputLabel>
                            <Select
                                value={selectedProductId}
                                onChange={handleProductChange}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Producto' }}
                            >
                                <MenuItem value="">
                            
                                </MenuItem>
                                {products.map((prod) => (
                                    <MenuItem key={prod.id} value={prod.id}>
                                        {prod.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Cantidad"
                            variant="outlined"
                            type="number"
                            fullWidth
                            value={quantity === '' ? '' : quantity}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                            placeholder="Introduce la cantidad"
                            required
                        />
                    </Grid>
                    {error && (
                        <Grid item>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}
                    <Grid item container spacing={1} justifyContent="flex-end">
                        <Button type="submit" color="success" variant="contained" endIcon={<FaSave />} sx={{ mr: 1 }}>
                            {inventoryItem ? 'Actualizar' : 'Añadir'}
                        </Button>
                        <Button type="button" color="error" variant="outlined" onClick={onClose} endIcon={<FaTimes />} sx={{ ml: 1 }}>
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
        </Card>
    );
};

export default InventoryForm;
