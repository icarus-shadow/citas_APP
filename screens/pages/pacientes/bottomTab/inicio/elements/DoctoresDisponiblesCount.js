import React, { useState, useEffect } from 'react';
import CountCard from '../../../../../../components/cards/CountCard';
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
        <CountCard
            title="Doctores Disponibles"
            number={count}
        />
    );
};

export default DoctoresDisponiblesCount;