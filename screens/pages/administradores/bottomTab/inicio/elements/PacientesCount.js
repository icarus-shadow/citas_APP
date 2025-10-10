import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";

let col = colors;



const PacientesCount = () => {
    const [pacientesCount, setPacientesCount] = useState(0);

    useEffect(() => {
        const fetchPacientesCount = async () => {
            try {
                console.log('[DEBUG] PacientesCount: Iniciando fetchPacientesCount');
                const response = await ApiService.countPacientes();
                console.log('[DEBUG] PacientesCount: Respuesta de API:', response);
                if (response.total === undefined) {
                    console.log(`[DEBUG] PacientesCount: no hay pacientes, response.total es undefined`);
                    setPacientesCount(0);
                } else {
                    console.log(`[DEBUG] PacientesCount: Total pacientes:`, response.total);
                    setPacientesCount(response.total);
                }
            } catch (error) {
                console.error('[DEBUG] PacientesCount: Error fetching pacientes count:', error);
                console.error('[DEBUG] PacientesCount: Error message:', error.message);
                console.error('[DEBUG] PacientesCount: Error status:', error.status);
                // En caso de error, mantener el estado en 0
                setPacientesCount(0);
            }
        };
        fetchPacientesCount();
    }, []);

    return (
        <Card
            title={`Pacientes`}
            subtitle={`Total de pacientes en el \nsistema: `}
            count={pacientesCount}
        />
    )
}

export default PacientesCount;
