import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";

let col = colors;

const EspecialidadesCount = () => {
    const [especialidadesCount, setEspecialidadesCount] = useState(0);

    useEffect(() => {
        const fetchEspecialidadesCount = async () => {
            try {
                const response = await ApiService.countEspecialidades();
                if (response.total === undefined) {
                    console.log(`no hay especialidades`);
                    setEspecialidadesCount(0);
                } else {
                    setEspecialidadesCount(response.total);
                }
            } catch (error) {
                console.error('Error fetching especialidades count:', error);
            }
        };
        fetchEspecialidadesCount();
    }, []);

    return (
        <Card
            title={`Especialidades`}
            subtitle={`Total de Especialidades en \nel sistema: `}
            count={especialidadesCount}
        />
    )
}

export default EspecialidadesCount;