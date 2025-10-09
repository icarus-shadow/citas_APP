import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";

let col = colors;

const HorariosCount = () => {
    const [horariosCount, setHorariosCount] = useState(0);

    useEffect(() => {
        const fetchHorariosCount = async () => {
            try {
                const response = await ApiService.countHorarios();
                if (response.total === undefined) {
                    console.log(`no hay horarios`);
                    setHorariosCount(0);
                } else {
                    setHorariosCount(response.total);
                }
            } catch (error) {
                console.error('Error fetching horarios count:', error);
            }
        };
        fetchHorariosCount();
    }, []);

    return (
        <Card
            title={`Horarios`}
            subtitle={`Total de plantillas de horarios: `}
            count={horariosCount}
        />
    )
}

export default HorariosCount;