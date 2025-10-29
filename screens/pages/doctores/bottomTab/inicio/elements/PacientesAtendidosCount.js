import Card from "../../../../../../components/cards/Card";
import React, {useEffect} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import {useSelector, useDispatch} from "react-redux";
import {fetchPacientesAtendidosCounter} from "../../../../../../utils/slices/counters/PacientesAtendidosCounterSlice";

let col = colors;

const PacientesAtendidosCount = () => {
    const dispatch = useDispatch();
    const doctorId = useSelector((state) => state.auth.user?.id);
    const pacientesAtendidosCount = useSelector((state) => state.pacientesAtendidosCounter.pacientesAtendidosCount);

    useEffect(() => {
        console.log('[PacientesAtendidosCount] doctorId:', doctorId);
        console.log('[PacientesAtendidosCount] pacientesAtendidosCount:', pacientesAtendidosCount);
        if (doctorId) {
            console.log('[PacientesAtendidosCount] Despachando fetchPacientesAtendidosCounter con doctorId:', doctorId);
            dispatch(fetchPacientesAtendidosCounter(doctorId));
        } else {
            console.log('[PacientesAtendidosCount] No hay doctorId, no se despacha la acción');
        }
    }, [doctorId, dispatch]);

    return (
        <Card
            title={`Pacientes atendidos`}
            subtitle={`Total de pacientes atendidos: `}
            count={pacientesAtendidosCount}
        />
    )
}

export default PacientesAtendidosCount;