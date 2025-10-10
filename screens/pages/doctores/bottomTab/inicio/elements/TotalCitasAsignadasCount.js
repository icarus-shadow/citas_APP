import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";
import {useSelector} from "react-redux";

let col = colors;

const TotalCitasAsignadasCount = () => {
    const [citasAsignadasCount, setCitasAsignadasCount] = useState(0);
    const doctorId = useSelector((state) => state.auth.user?.id);

    useEffect(() => {
        const fetchCitasAsignadasCount = async () => {
            if (!doctorId) return;
            try {
                console.log('[DEBUG] TotalCitasAsignadasCount: Iniciando fetchCitasAsignadasCount para doctorId:', doctorId);
                const response = await ApiService.countCitasAsignadas(doctorId);
                console.log('[DEBUG] TotalCitasAsignadasCount: Respuesta de API:', response);
                if (response.total === undefined) {
                    console.log(`[DEBUG] TotalCitasAsignadasCount: no hay citas asignadas, response.total es undefined`);
                    setCitasAsignadasCount(0);
                } else {
                    console.log(`[DEBUG] TotalCitasAsignadasCount: Total citas asignadas:`, response.total);
                    setCitasAsignadasCount(response.total);
                }
            } catch (error) {
                console.error('[DEBUG] TotalCitasAsignadasCount: Error fetching citas asignadas count:', error);
                console.error('[DEBUG] TotalCitasAsignadasCount: Error message:', error.message);
                console.error('[DEBUG] TotalCitasAsignadasCount: Error status:', error.status);
                // En caso de error, mantener el estado en 0
                setCitasAsignadasCount(0);
            }
        };
        fetchCitasAsignadasCount();
    }, [doctorId]);

    return (
        <Card
            title={`Total de citas asignadas`}
            subtitle={`Total de citas asignadas al doctor: `}
            count={citasAsignadasCount}
        />
    )
}

export default TotalCitasAsignadasCount;