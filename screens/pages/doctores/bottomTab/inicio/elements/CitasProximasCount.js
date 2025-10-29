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
        if (doctorId) {
            dispatch(fetchCitasProximasCounter(doctorId));
        }
    }, [doctorId, dispatch]);

    return (
        <Card
            title={`Citas próximas`}
            subtitle={`Total de citas próximas: `}
            count={citasProximasCount}
        />
    )
}

export default CitasProximasCount;