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
        if (doctorId) {
            dispatch(fetchCitasAsignadasCounter(doctorId));
        }
    }, [doctorId, dispatch]);

    return (
        <Card
            title={`Total de citas asignadas`}
            subtitle={`Total de citas asignadas al doctor: `}
            count={citasAsignadasCount}
        />
    )
}

export default TotalCitasAsignadasCount;