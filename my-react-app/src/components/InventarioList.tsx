import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, InventoryItem } from '../types/types';
import InventoryForm from './invetarioForm';
import { Button, Card, CardBody, CardHeader, CardFooter } from '@nextui-org/react';

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
        <Card style={{ padding: '20px', width: '100%',marginTop:'10%' }}>   
            <h1>Inventario</h1>
            <Button color='success' style={{ margin: '20px 0' }} onClick={handleAddProductClick}>Añadir</Button>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {inventory.map((item) => {
                    const product = products.find(p => p.id === item.product_id);
                    return (
                        <div key={item.id} style={{ flex: '1 1 calc(33.333% - 20px)', boxSizing: 'border-box' }}>
                            <Card>
                                <CardHeader>
                                    <p >{product ? product.name : 'Unknown Product'}</p>
                                </CardHeader>
                                <CardBody>
                                    <p>Cantidad: {item.quantity}</p>
                                </CardBody>
                                <CardFooter>
                                    <Button color="warning" onClick={() => handleEditClick(item)}>Editar</Button>
                                    <Button color="danger" onClick={() => handleDelete(item.id)} style={{ marginLeft: '10px' }}>Borrar</Button>
                                </CardFooter>
                            </Card>
                        </div>
                    );
                })}
            </div>
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