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
        if (doctorId) {
            dispatch(fetchPacientesAtendidosCounter(doctorId));
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