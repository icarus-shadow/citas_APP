import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";

let col = colors;

const DoctoresCount = () => {
    const [doctoresCount, setDoctoresCount] = useState(0);

    useEffect(() => {
        const fetchDoctoresCount = async () => {
            try {
                console.log('[DEBUG] DoctoresCount: Iniciando fetchDoctoresCount');
                const response = await ApiService.countDoctores();
                console.log('[DEBUG] DoctoresCount: Respuesta de API:', response);
                if (response.total === undefined) {
                    console.log(`[DEBUG] DoctoresCount: no hay doctores, response.total es undefined`);
                    setDoctoresCount(0);
                } else {
                    console.log(`[DEBUG] DoctoresCount: Total doctores:`, response.total);
                    setDoctoresCount(response.total);
                }
            } catch (error) {
                console.error('[DEBUG] DoctoresCount: Error fetching doctores count:', error);
                console.error('[DEBUG] DoctoresCount: Error message:', error.message);
                console.error('[DEBUG] DoctoresCount: Error status:', error.status);
                // En caso de error, mantener el estado en 0
                setDoctoresCount(0);
            }
        };
        fetchDoctoresCount();
    }, []);

    return (
        <Card
            title={`Doctores`}
            subtitle={`Total de doctores en el \nsistema: `}
            count={doctoresCount}
        />
    )
}

export default DoctoresCount;