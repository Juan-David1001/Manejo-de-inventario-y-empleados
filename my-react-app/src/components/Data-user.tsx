import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

const API_URL_DINAADMIN = 'http://192.168.0.16:5000/api/dinamic';

const UserDataTable: React.FC = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [userData, setUserData] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(API_URL_DINAADMIN);
                setUserData(response.data.rows);
                setColumns(response.data.columns);
            } catch (error) {
                setError('Failed to fetch user data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        {columns.map(column => (
                            <TableCell key={column}>{column}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userData.map((data, index) => (
                        <TableRow key={index} sx={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'transparent' }}>
                            <TableCell>{data.id}</TableCell>
                            {columns.map(column => (
                                <TableCell key={column}>{data[column]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserDataTable;
