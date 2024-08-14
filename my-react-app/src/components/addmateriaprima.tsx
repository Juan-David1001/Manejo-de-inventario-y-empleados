import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RawMaterial, AddRawMaterialPayload } from '../types/types';
import { 
    Container, 
    TextField, 
    Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography 
} from '@mui/material';
import { parse, format } from 'date-fns';
import { es } from 'date-fns/locale';

const API_URL = 'http://192.168.0.16:5000/api/materia-prima'; // URL base para la API

const RawMaterialTable: React.FC = () => {
    const [materials, setMaterials] = useState<RawMaterial[]>([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState<number | ''>('');
    const [price, setPrice] = useState<number | ''>('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        try {
            const response = await axios.get<RawMaterial[]>(API_URL);
            if (Array.isArray(response.data)) {
                setMaterials(response.data);
            } else {
                console.error('Response data is not an array:', response.data);
            }
        } catch (error) {
            console.error('Error fetching raw materials:', error);
        }
    };

    const handleAddMaterial = async () => {
        if (name.trim() && quantity !== '' && price !== '') {
            const payload: AddRawMaterialPayload = { 
                nombre: name, 
                cantidad: Number(quantity), 
                precio: Number(price) 
            };

            console.log('Sending payload:', payload); // Muestra el payload en la consola

            try {
                const response = await axios.post(API_URL, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Response:', response.data); // Muestra la respuesta del servidor
                fetchMaterials();
                resetForm();
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error('Error adding raw material:', error.response?.data || error.message);
                } else {
                    console.error('Unexpected error:', error);
                }
            }
        } else {
            console.error('Please provide all required fields.');
        }
    };

    const handleEditMaterial = async () => {
        if (editingId !== null && name && quantity !== '' && price !== '') {
            const payload: AddRawMaterialPayload = { 
                nombre: name, 
                cantidad: Number(quantity), 
                precio: Number(price) 
            };
            try {
                await axios.put(`${API_URL}/${editingId}`, payload);
                fetchMaterials();
                resetForm();
                setEditingId(null);
            } catch (error) {
                console.error('Error updating raw material:', error);
            }
        }
    };

    const handleDeleteMaterial = async (id: number) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchMaterials();
        } catch (error) {
            console.error('Error deleting raw material:', error);
        }
    };

    const handleEditClick = (material: RawMaterial) => {
        setName(material.nombre);
        setQuantity(material.cantidad);
        setPrice(material.precio);
        setEditingId(material.id);
    };

    const resetForm = () => {
        setName('');
        setQuantity('');
        setPrice('');
    };

    return (
        <Container style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor:'white'
        }}>
            <Typography variant="h4" gutterBottom>Raw Material Management</Typography>
            <TextField
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <TextField
                label="Cantidad"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={quantity === '' ? '' : quantity}
                onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <TextField
                label="Precio"
                type="number"
                variant="outlined"
                fullWidth
                margin="normal"
                value={price === '' ? '' : price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <Button 
                variant="contained" 
                color="success" 
                onClick={editingId === null ? handleAddMaterial : handleEditMaterial}
                style={{ marginTop: 16 }}
            >
                {editingId === null ? 'Añadir material' : 'Actualizar Material'}
            </Button>
            <TableContainer component={Paper} style={{ marginTop: 16 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Aciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.map((material) => (
                            <TableRow key={material.id}>
                                <TableCell>{material.nombre}</TableCell>
                                <TableCell>{material.cantidad}</TableCell>
                                <TableCell>{material.precio}</TableCell>
                                <TableCell>{format(parse(material.fecha_ingreso, 'M/d/yyyy, h:mm:ss a', new Date()), 'dd/MM/yyyy, h:mm:ss a', { locale: es })}</TableCell>
                               
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="warning" 
                                        onClick={() => handleEditClick(material)}
                                    >
                                        Editar
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        onClick={() => handleDeleteMaterial(material.id)}
                                        style={{ marginLeft: 8 }}
                                    >
                                        Borrar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default RawMaterialTable;
