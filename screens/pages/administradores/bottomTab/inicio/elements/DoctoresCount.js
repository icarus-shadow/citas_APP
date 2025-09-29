import Card from "../../../../../../components/cards/Card";
import React, {useEffect, useState} from "react";
import {colors} from "../../../../../../utils/desing/Colors";
import ApiService from "../../../../../../Src/services/api/Api";

let col = colors;

const DoctoresCount = () => {
    const [doctoresCount, setDoctoresCount] = useState(0);

    useEffect(() => {
        const fetchDoctoresCount = async () => {
            try {
                const response = await ApiService.request('/countCitas');
                if (response.total === undefined) {
                    console.log(`no hay citas`);
                    setDoctoresCount(0);
                } else {
                    setDoctoresCount(response.total);
                }
            } catch (error) {
                console.error('Error fetching citas count:', error);
            }
        };
        fetchDoctoresCount();
    }, []);

    return (
        <Card
            title={`Doctores`}
            subtitle={`Total de doctores en el \nsistema: `}
            count={doctoresCount}
        />
    )
}

export default DoctoresCount;