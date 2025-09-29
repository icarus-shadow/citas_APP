import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";

let col = colors;



const PacientesCount = () => {
    const [pacientesCount, setPacientesCount] = useState(0);

    useEffect(() => {
        const fetchPacientesCount = async () => {
            try {
                const response = await ApiService.request('/countPacientes');
                if (response.total === undefined) {
                    console.log(`no hay pacientes`);
                    setPacientesCount(0);
                } else {
                    setPacientesCount(response.total);
                }
            } catch (error) {
                console.error('Error fetching citas count:', error);
            }
        };
        fetchPacientesCount();
    }, []);

    return (
        <Card
            title={`Pacientes`}
            subtitle={`Total de pacientes en el \nsistema: `}
            count={pacientesCount}
        />
    )
}

export default PacientesCount;