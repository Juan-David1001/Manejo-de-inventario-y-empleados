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
            console.error('Error fetching products:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
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
        <Container >
            <Typography variant="h4" gutterBottom>
                Product List
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddProductClick}
                style={{ marginBottom: '20px' }}
            >
                Add New Product
            </Button>
            <TableContainer component={Paper} >
                <Table >
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.price}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="outlined" 
                                        color="primary"
                                        onClick={() => handleEditClick(product)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        variant="outlined" 
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
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
