import Card from "../../../../../../components/cards/Card";
import React, {useEffect} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import {useSelector, useDispatch} from "react-redux";
import {fetchCitasProximasCounter} from "../../../../../../utils/slices/counters/CitasProximasCounterSlice";

let col = colors;

const CitasProximasCount = () => {
    const dispatch = useDispatch();
    const doctorId = useSelector((state) => state.auth.user?.id);
    const citasProximasCount = useSelector((state) => state.citasProximasCounter.citasProximasCount);

    useEffect(() => {
        console.log('[CitasProximasCount] doctorId:', doctorId);
        console.log('[CitasProximasCount] citasProximasCount:', citasProximasCount);
        console.log('[CitasProximasCount] Estado actual del contador:', citasProximasCount);
        if (doctorId) {
            console.log('[CitasProximasCount] Despachando fetchCitasProximasCounter con doctorId:', doctorId);
            dispatch(fetchCitasProximasCounter(doctorId));
        } else {
            console.log('[CitasProximasCount] No hay doctorId, no se despacha la acción');
        }
    }, [doctorId, dispatch, citasProximasCount]);

    return (
        <Card
            title={`Citas próximas`}
            subtitle={`Total de citas próximas: `}
            count={citasProximasCount}
        />
    )
}

export default CitasProximasCount;