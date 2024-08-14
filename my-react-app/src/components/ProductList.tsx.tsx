import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../types/types';
import ProductForm from './ProductForm';
import { Button, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const API_URL = 'http://192.168.0.16:5000/api/products';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>(API_URL);
            setProducts(response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    const handleEditClick = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleAddProductClick = () => {
        setEditingProduct(null);
        setShowForm(true);
    };

    return (
        <Container
            sx={{
                width: '90vw',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                backgroundColor: '#f9f9f9',
            }}
        >
            <Typography variant="h4" gutterBottom align="center">
                Lista de Productos
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddProductClick}
                sx={{ mb: 2 }}
            >
                Añadir nuevo producto
            </Button>
            <TableContainer component={Paper} sx={{ width: '100%', maxWidth: '1000px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outlined" 
                                        color="primary"
                                        onClick={() => handleEditClick(product)}
                                        sx={{ mr: 1 }}
                                    >
                                        Editar
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {showForm && <ProductForm product={editingProduct} onClose={() => setShowForm(false)} />}
        </Container>
    );
};

export default ProductList;
