import Card from "../../../../../../components/cards/Card";
import React, {useEffect} from "react";
import {colors} from "../../../../../../utils/desing/Colors";

import {useDispatch, useSelector} from "react-redux";
import {fetchDoctoresCounter} from "../../../../../../utils/slices/counters/DoctoresCounterSlice";

let col = colors;

const DoctoresCount = () => {

    const dispatch = useDispatch();
    const doctoresCount = useSelector((state) => state.doctoresCounter.doctoresCount);


    return (
        <Card
            title={`Doctores`}
            subtitle={`Total de doctores en el \nsistema: `}
            count={doctoresCount}
        />
    )
}

export default DoctoresCount;