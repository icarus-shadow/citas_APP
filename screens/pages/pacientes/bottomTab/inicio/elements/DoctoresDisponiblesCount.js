import React, { useState, useEffect } from 'react';
import Card from '../../../../../../components/cards/Card';
import ApiService from '../../../../../../Src/services/api/Api';

const DoctoresDisponiblesCount = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ApiService.getDoctores();
                setCount(response.length);
            } catch (error) {
                console.error('Error fetching doctores disponibles:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <Card
            title="Doctores Disponibles"
            subtitle={`Total de doctores disponibles \nen el sistema: `}
            count={count}
        />
    );
};

export default DoctoresDisponiblesCount;