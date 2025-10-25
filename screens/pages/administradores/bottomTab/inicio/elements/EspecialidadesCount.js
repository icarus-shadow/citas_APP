import Card from "../../../../../../components/cards/Card";
import React, {useEffect} from "react";
import {colors} from "../../../../../../utils/desing/Colors";

import {useDispatch, useSelector} from "react-redux";
import {fetchEspecialidadesCounter} from "../../../../../../utils/slices/counters/EspecialidadesCounterSlice";

let col = colors;

const EspecialidadesCount = () => {

    const dispatch = useDispatch();
    const especialidadesCount = useSelector((state) => state.especialidadesCounter.especialidadesCount);


    return (
        <Card
            title={`Especialidades`}
            subtitle={`Total de Especialidades en \nel sistema: `}
            count={especialidadesCount}
        />
    )
}

export default EspecialidadesCount;