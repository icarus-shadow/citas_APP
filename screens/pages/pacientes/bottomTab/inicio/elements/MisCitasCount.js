import React, { useState, useEffect } from 'react';
import Card from '../../../../../../components/cards/Card';
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
        <Card
            title="Mis Citas"
            subtitle={`Total de mis citas \nen el sistema: `}
            count={count}
        />
    );
};

export default MisCitasCount;