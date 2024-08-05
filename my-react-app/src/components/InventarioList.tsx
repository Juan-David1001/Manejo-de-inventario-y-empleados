import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, InventoryItem } from '../types/types';
import InventoryForm from './invetarioForm';
import { Button, Card, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';

const API_URL_PRODUCTS = 'http://192.168.0.16:5000/api/products';
const API_URL_INVENTORY = 'http://192.168.0.16:5000/api/inventory';

const InventarioList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchInventory();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>(API_URL_PRODUCTS);
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchInventory = async () => {
        try {
            const response = await axios.get<InventoryItem[]>(API_URL_INVENTORY);
            setInventory(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`${API_URL_INVENTORY}/${id}`);
            fetchInventory();
        } catch (error) {
            console.error('Error deleting inventory item:', error);
        }
    };

    const handleEditClick = (inventoryItem: InventoryItem) => {
        const product = products.find(p => p.id === inventoryItem.product_id) || null;
        setEditingProduct(product);
        setEditingInventoryItem(inventoryItem);
        setShowForm(true);
    };

    const handleAddProductClick = () => {
        setEditingProduct(null);
        setEditingInventoryItem(null);
        setShowForm(true);
    };

    return (
        <Card style={{ padding: '20px', width: '100%' }}>
            <h1>Inventario</h1>
            <Button style={{ margin: '20px 0' }} onClick={handleAddProductClick}>Añadir</Button>
            <Table aria-label="Inventory Table" style={{ height: "auto", minWidth: "100%" }}>
                <TableHeader>
                    <TableColumn>Producto</TableColumn>
                    <TableColumn>Cantidad</TableColumn>
                    <TableColumn>Acciones</TableColumn>
                </TableHeader>
                <TableBody>
                    {inventory.map((item) => {
                        const product = products.find(p => p.id === item.product_id);
                        return (
                            <TableRow key={item.id}>
                                <TableCell>{product ? product.name : 'Unknown Product'}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>
                                    <Button color="warning" onClick={() => handleEditClick(item)}>Edit</Button>
                                    <Button color="danger" onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px' }}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {showForm && (
                <InventoryForm
                    product={editingProduct}
                    inventoryItem={editingInventoryItem}
                    onClose={() => setShowForm(false)}
                />
            )}
        </Card>
    );
};

export default InventarioList;
