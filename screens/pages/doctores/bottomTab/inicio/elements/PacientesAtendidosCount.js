import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";
import {useSelector} from "react-redux";

let col = colors;

const PacientesAtendidosCount = () => {
    const [pacientesAtendidosCount, setPacientesAtendidosCount] = useState(0);
    const doctorId = useSelector((state) => state.auth.user?.id);

    useEffect(() => {
        const fetchPacientesAtendidosCount = async () => {
            if (!doctorId) return;
            try {
                console.log('[DEBUG] PacientesAtendidosCount: Iniciando fetchPacientesAtendidosCount para doctorId:', doctorId);
                const response = await ApiService.countPacientesAtendidos(doctorId);
                console.log('[DEBUG] PacientesAtendidosCount: Respuesta de API:', response);
                if (response.total === undefined) {
                    console.log(`[DEBUG] PacientesAtendidosCount: no hay pacientes atendidos, response.total es undefined`);
                    setPacientesAtendidosCount(0);
                } else {
                    console.log(`[DEBUG] PacientesAtendidosCount: Total pacientes atendidos:`, response.total);
                    setPacientesAtendidosCount(response.total);
                }
            } catch (error) {
                console.error('[DEBUG] PacientesAtendidosCount: Error fetching pacientes atendidos count:', error);
                console.error('[DEBUG] PacientesAtendidosCount: Error message:', error.message);
                console.error('[DEBUG] PacientesAtendidosCount: Error status:', error.status);
                // En caso de error, mantener el estado en 0
                setPacientesAtendidosCount(0);
            }
        };
        fetchPacientesAtendidosCount();
    }, [doctorId]);

    return (
        <Card
            title={`Pacientes atendidos`}
            subtitle={`Total de pacientes atendidos: `}
            count={pacientesAtendidosCount}
        />
    )
}

export default PacientesAtendidosCount;