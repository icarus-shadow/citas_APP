import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";

let col = colors;

const AdministradoresCount = () => {
    const [administradoresCount, setAdministradoresCount] = useState(0);

    useEffect(() => {
        const fetchAdministradoresCount = async () => {
            try {
                const response = await ApiService.request('/countCitas');
                if (response.total === undefined) {
                    console.log(`no hay citas`);
                    setAdministradoresCount(0);
                } else {
                    setAdministradoresCount(response.total);
                }
            } catch (error) {
                console.error('Error fetching citas count:', error);
            }
        };
        fetchAdministradoresCount();
    }, []);

    return (
        <Card
            title={`Administradores`}
            subtitle={`Total de Administradores \nen el sistema: `}
            count={administradoresCount}
        />
    )
}

export default AdministradoresCount;