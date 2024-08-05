import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import { Product, InventoryItem } from '../types/types';
import { TextField, Typography, Grid, Snackbar, Alert, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, useMediaQuery, useTheme } from '@mui/material';
import { Button, Card } from '@mui/material';

const API_URL_PRODUCTS = 'http://192.168.0.16:5000/api/products';
const API_URL_INVENTORY = 'http://192.168.0.16:5000/api/inventory';

interface InventoryFormProps {
    product: Product | null;
    inventoryItem?: InventoryItem | null; // Make inventoryItem optional
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
            console.error('Error fetching products:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedProductId === '' || quantity === '' || quantity <= 0) {
            setError('Please provide a valid product and quantity.');
            return;
        }

        const payload = { product_id: Number(selectedProductId), quantity: Number(quantity) };

        try {
            if (inventoryItem) {
                // Update existing inventory item
                await axios.put(`${API_URL_INVENTORY}/${inventoryItem.id}`, payload);
                setSnackbarMessage('Inventory item updated successfully.');
            } else {
                // Add new inventory item
                await axios.post(API_URL_INVENTORY, payload);
                setSnackbarMessage('Inventory item added successfully.');
            }
            setOpenSnackbar(true);
            onClose();
        } catch (error) {
            console.error('Error saving inventory item:', error);
            setSnackbarMessage('Failed to save inventory item. Please try again.');
            setOpenSnackbar(true);
        }
    };

    const handleProductChange = (event: SelectChangeEvent<number>) => {
        setSelectedProductId(event.target.value as number);
    };

    return (
        <Card 
            style={{
                backgroundColor: 'white',
                width: isSmallScreen ? '90vw' : '30vw',
                height: isSmallScreen ? 'auto' : '20vw',
                padding: '15px',
                margin: 'auto',
                marginTop: isSmallScreen ? '20px' : '0',
            }}
        >
            <Typography variant="h4" gutterBottom>
                {inventoryItem ? 'Edit Inventory Item' : 'Añadir Item '}
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
                            >
                                <MenuItem value="">
                                    <em></em>
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
                            placeholder="Cantidad"
                            required
                        />
                    </Grid>
                    {error && (
                        <Grid item>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}
                    <Grid item>
                        <Button type="submit" color="success" variant="contained">
                            {inventoryItem ? 'Update Inventory Item' : 'Añadir'}
                        </Button>
                        <Button type="button" color="error" variant="outlined" onClick={onClose} style={{ marginLeft: '10px' }}>
                            Cancel
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
