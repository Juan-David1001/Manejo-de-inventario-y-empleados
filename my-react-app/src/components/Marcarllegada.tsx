import axios from "axios";
import { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";

export const Marcarllegada = () => {
    const [llegada, setLlegada] = useState<string>('');
    const [canMark, setCanMark] = useState<boolean>(false);
    const api = 'http://192.168.0.16:5000/api/llegada';
    const checkApi = 'http://192.168.0.16:5000/api/has-marked-today'; // Endpoint para verificar
    const username = localStorage.getItem('username');

    useEffect(() => {
        const checkIfMarkedToday = async () => {
            if (username) {
                try {
                    const response = await axios.get(`${checkApi}/${username}`);
                    setCanMark(!response.data.hasMarked);
                } catch (error) {
                    console.error('Error al verificar si ya se marcó hoy:', error);
                }
            }
        };

        checkIfMarkedToday();
    }, [username]);

    const marcarLlegada = async () => {
        if (!username) {
            setLlegada('No se ha encontrado el nombre de usuario');
            return;
        }

        const horaActual = new Date().toTimeString().split(' ')[0]; // Obtener la hora actual en formato 'HH:MM:SS'

        try {
            await axios.post(api, {
                username: username,
                hora_entrada: horaActual
            });
            setLlegada('Llegada marcada correctamente');
            setCanMark(false); // Desactivar el botón después de marcar
        } catch (error) {
            console.error('Error al marcar la llegada:', error);
            setLlegada('Error al marcar la llegada');
        }
    };

    return (
        <div>
            {canMark && <Button  style={{
                backgroundColor: '#f7b750',
                


            }} onClick={marcarLlegada}>Marcar llegada</Button>}
            <p>{llegada}</p>
        </div>
    );
};
