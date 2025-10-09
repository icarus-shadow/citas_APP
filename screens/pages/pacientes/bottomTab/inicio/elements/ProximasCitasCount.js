import React, { useState, useEffect } from 'react';
import CountCard from '../../../../../../components/cards/CountCard';
import ApiService from '../../../../../../Src/services/api/Api';

const ProximasCitasCount = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ApiService.getMisCitas();
                const today = new Date().toISOString().split('T')[0];
                const upcoming = response.filter(cita => cita.fecha_cita > today);
                setCount(upcoming.length);
            } catch (error) {
                console.error('Error fetching proximas citas:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <CountCard
            title="Próximas Citas"
            number={count}
        />
    );
};

export default ProximasCitasCount;