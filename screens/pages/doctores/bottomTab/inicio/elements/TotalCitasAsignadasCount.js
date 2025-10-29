import Card from "../../../../../../components/cards/Card";
import React, {useEffect} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import {useSelector, useDispatch} from "react-redux";
import {fetchCitasAsignadasCounter} from "../../../../../../utils/slices/counters/CitasAsignadasCounterSlice";

let col = colors;

const TotalCitasAsignadasCount = () => {
    const dispatch = useDispatch();
    const doctorId = useSelector((state) => state.auth.user?.id);
    const citasAsignadasCount = useSelector((state) => state.citasAsignadasCounter.citasAsignadasCount);

    useEffect(() => {
        console.log('[TotalCitasAsignadasCount] doctorId:', doctorId);
        console.log('[TotalCitasAsignadasCount] citasAsignadasCount:', citasAsignadasCount);
        console.log('[TotalCitasAsignadasCount] Estado actual del contador:', citasAsignadasCount);
        if (doctorId) {
            console.log('[TotalCitasAsignadasCount] Despachando fetchCitasAsignadasCounter con doctorId:', doctorId);
            dispatch(fetchCitasAsignadasCounter(doctorId));
        } else {
            console.log('[TotalCitasAsignadasCount] No hay doctorId, no se despacha la acción');
        }
    }, [doctorId, dispatch, citasAsignadasCount]);

    return (
        <Card
            title={`Total de citas asignadas`}
            subtitle={`Total de citas asignadas al doctor: `}
            count={citasAsignadasCount}
        />
    )
}

export default TotalCitasAsignadasCount;