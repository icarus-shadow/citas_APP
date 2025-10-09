import React, { useState, useEffect } from 'react';
import CountCard from '../../../../../../components/cards/CountCard';
import ApiService from '../../../../../../Src/services/api/Api';

const MisCitasCount = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await ApiService.getMisCitas();
                setCount(response.length);
            } catch (error) {
                console.error('Error fetching mis citas:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <CountCard
            title="Mis Citas"
            number={count}
        />
    );
};

export default MisCitasCount;