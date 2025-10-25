import Card from "../../../../../../components/cards/Card";
import React, {useEffect} from "react";
import {colors} from "../../../../../../utils/desing/Colors";

import {useDispatch, useSelector} from "react-redux";
import {fetchHorariosCounter} from "../../../../../../utils/slices/counters/HorariosCounterSlice";

let col = colors;

const HorariosCount = () => {

    const dispatch = useDispatch();
    const horariosCount = useSelector((state) => state.horariosCounter.horariosCount);


    return (
        <Card
            title={`Horarios`}
            subtitle={`Total de plantillas de horarios: `}
            count={horariosCount}
        />
    )
}

export default HorariosCount;