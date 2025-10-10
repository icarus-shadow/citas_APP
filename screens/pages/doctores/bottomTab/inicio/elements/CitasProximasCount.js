import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";
import {useSelector} from "react-redux";

let col = colors;

const CitasProximasCount = () => {
    const [citasProximasCount, setCitasProximasCount] = useState(0);
    const doctorId = useSelector((state) => state.auth.user?.id);

    useEffect(() => {
        const fetchCitasProximasCount = async () => {
            if (!doctorId) return;
            try {
                console.log('[DEBUG] CitasProximasCount: Iniciando fetchCitasProximasCount para doctorId:', doctorId);
                const response = await ApiService.countCitasProximas(doctorId);
                console.log('[DEBUG] CitasProximasCount: Respuesta de API:', response);
                if (response.total === undefined) {
                    console.log(`[DEBUG] CitasProximasCount: no hay citas próximas, response.total es undefined`);
                    setCitasProximasCount(0);
                } else {
                    console.log(`[DEBUG] CitasProximasCount: Total citas próximas:`, response.total);
                    setCitasProximasCount(response.total);
                }
            } catch (error) {
                console.error('[DEBUG] CitasProximasCount: Error fetching citas próximas count:', error);
                console.error('[DEBUG] CitasProximasCount: Error message:', error.message);
                console.error('[DEBUG] CitasProximasCount: Error status:', error.status);
                // En caso de error, mantener el estado en 0
                setCitasProximasCount(0);
            }
        };
        fetchCitasProximasCount();
    }, [doctorId]);

    return (
        <Card
            title={`Citas próximas`}
            subtitle={`Total de citas próximas: `}
            count={citasProximasCount}
        />
    )
}

export default CitasProximasCount;