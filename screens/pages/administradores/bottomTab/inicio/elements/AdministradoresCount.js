import Card from "../../../../../../components/cards/Card";
import React, {useEffect} from "react";
import {colors} from "../../../../../../utils/desing/Colors";

import {useDispatch, useSelector} from "react-redux";
import {fetchAdministradoresCounter} from "../../../../../../utils/slices/counters/AdministradoresCounterSlice";

let col = colors;

const AdministradoresCount = () => {

    const dispatch = useDispatch();
    const administradoresCount = useSelector((state) => state.administradoresCounter.administradoresCount);

    return (
        <Card
            title={`Administradores`}
            subtitle={`Total de Administradores \nen el sistema: `}
            count={administradoresCount}
        />
    )
}

export default AdministradoresCount;