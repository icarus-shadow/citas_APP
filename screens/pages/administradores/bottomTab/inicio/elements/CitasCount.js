import Card from "../../../../../../components/cards/Card";
import React, {useEffect} from "react";
import {colors} from "../../../../../../utils/desing/Colors";

import {useDispatch, useSelector} from "react-redux";
import {fetchCitasCounter} from "../../../../../../utils/slices/counters/CitasCounterSlice";

let col = colors;

const CitasCount = () => {

    const dispatch = useDispatch();
    const citasCount = useSelector((state) => state.citasCounter.citasCount);

    useEffect(() => {
        dispatch(fetchCitasCounter());
    }, []);

    return (
        <Card
            title={`Citas`}
            subtitle={`Total de citas en el sistema: `}
            count={citasCount}
        />
    )
}

export default CitasCount;