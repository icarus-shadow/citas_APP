import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";

import {useDispatch, useSelector} from "react-redux";
import {fetchPacientesCounter} from "../../../../../../utils/slices/counters/PacientesCounterSlice";

let col = colors;



const PacientesCount = () => {

    const dispatch = useDispatch();
    const pacientesCount = useSelector((state) => state.pacientesCounter.pacientesCount);

    useEffect(() => {
        dispatch(fetchPacientesCounter());
    })

    return (
        <Card
            title={`Pacientes`}
            subtitle={`Total de pacientes en el \n sistema: `}
            count={pacientesCount}
        />
    )
}

export default PacientesCount;
