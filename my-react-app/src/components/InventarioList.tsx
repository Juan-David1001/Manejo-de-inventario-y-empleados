import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product, InventoryItem } from '../types/types';
import InventoryForm from './invetarioForm';
import { Button, Card, CardBody, CardHeader, CardFooter } from '@nextui-org/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

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
        <Card className='p-6 w-full mx-auto mt-10'>
            <h1 className='text-2xl font-bold mb-4'>Inventario</h1>
            <Button color='success' className='mb-4 flex items-center' onClick={handleAddProductClick}>
                <FaPlus className='mr-2' /> Añadir
            </Button>
            <div className='flex flex-wrap gap-4'>
                {inventory.map((item) => {
                    const product = products.find(p => p.id === item.product_id);
                    return (
                        <div key={item.id} className='flex-1 min-w-[300px]'>
                            <Card className='shadow-lg'>
                                <CardHeader>
                                    <p className='text-lg font-semibold'>{product ? product.name : 'Unknown Product'}</p>
                                </CardHeader>
                                <CardBody>
                                    <p className='text-gray-700'>Cantidad: {item.quantity}</p>
                                </CardBody>
                                <CardFooter className='flex justify-between'>
                                    <Button color="warning" className='flex items-center' onClick={() => handleEditClick(item)}>
                                        <FaEdit className='mr-2' /> Editar
                                    </Button>
                                    <Button color="danger" className='flex items-center' onClick={() => handleDelete(item.id)}>
                                        <FaTrash className='mr-2' /> Borrar
                                    </Button>
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
