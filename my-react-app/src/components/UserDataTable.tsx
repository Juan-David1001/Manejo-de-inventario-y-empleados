import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Grid } from '@mui/material';

// Cambia esta URL por la de tu API
const API_URL_USER_DATA = 'http://192.168.0.16:5000/api/user-data';
const API_URL_ADD_USER_DATA = 'http://192.168.0.16:5000/api/user-data/add';

interface UserData {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any; // Permite claves dinámicas
}

const UserDataTable: React.FC = () => {
    const [userData, setUserData] = useState<UserData[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newRow, setNewRow] = useState<UserData>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [date, setDate] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const username = localStorage.getItem("username");
            if (!username) {
                setError('No username found in localStorage.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${API_URL_USER_DATA}?username=${username}`);
                const fetchedColumns = response.data.columns;

                // Excluir las columnas que ya están seteadas
                const filteredColumns = fetchedColumns.filter((col: string) => !['id', 'user_id', 'nombre', 'fecha'].includes(col));
                
                setColumns(filteredColumns);
                setUserData(response.data.data);

                // Establecer datos del usuario
                const userData = response.data.data[0] || {};
                setUserId(userData.user_id || username); 
                setUserName(userData.nombre || username);
                setDate(new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' }));
 
            } catch (error) {
                setError('Failed to fetch user data.');
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewRow({ ...newRow, [event.target.name]: event.target.value });
    };

    const handleSubmit = async () => {
        if (!userId || !userName || !date) {
            setFormError('Required data is missing.');
            return;
        }

        try {
            const response = await axios.post(API_URL_ADD_USER_DATA, {
                user_id: userId,
                nombre: userName,
                fecha: date,
                ...newRow,
            });
            setUserData([...userData, response.data.data]); // Añadir la nueva fila a la tabla
            setNewRow({});
        } catch (error) {
            setFormError('Failed to add user data.');
            console.error('Error adding user data:', error);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Container style={{
            backgroundColor:'white',
            width:'100vw'


        }}>
            <Typography variant="h4" gutterBottom>
                User Data
            </Typography>
            
            <Grid container spacing={2} marginBottom={2}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="User ID"
                        value={userId || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Name"
                        value={userName || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        label="Date"
                        value={date || ''}
                        InputProps={{ readOnly: true }}
                    />
                </Grid>
                {columns.map((column) => (
                    <Grid item xs={12} sm={6} md={4} key={column}>
                        <TextField
                            fullWidth
                            label={column}
                            name={column}
                            value={newRow[column] || ''}
                            onChange={handleInputChange}
                        />
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Add Row
                    </Button>
                </Grid>
                {formError && <Typography color="error">{formError}</Typography>}
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {['user_id', 'nombre', 'fecha', ...columns].map((column) => (
                                <TableCell key={column}>{column}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userData.map((row, index) => (
                            <TableRow key={index}>
                                {['user_id', 'nombre', 'fecha', ...columns].map((column) => (
                                    <TableCell key={column}>{row[column]}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default UserDataTable;
