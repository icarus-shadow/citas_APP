import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";

let col = colors;



const CitasCount = () => {
    const [citasCount, setCitasCount] = useState(0);

    useEffect(() => {
        const fetchCitasCount = async () => {
            try {
                const response = await ApiService.request('/countCitas');
                if (response.total === undefined) {
                    console.log(`no hay citas`);
                    setCitasCount(0);
                } else {
                    setCitasCount(response.total);
                }
            } catch (error) {
                console.error('Error fetching citas count:', error);
            }
        };
        fetchCitasCount();
    }, []);

    return (
        <Card
            title={`Citas`}
            subtitle={`Total de citas en el sistema: `}
            count={citasCount}
        />
    )
}

export default CitasCount;