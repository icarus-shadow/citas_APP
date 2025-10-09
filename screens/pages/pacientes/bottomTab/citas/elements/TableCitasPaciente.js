import React, { useEffect, useState } from 'react';
import {View} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";
import InfoCard from "../../../../../../components/cards/InfoCard";

export default function TableCitasPaciente({ onView }) {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [visible, setVisible] = useState(false);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [doctores, setDoctores] = useState({});

    const fetchDoctores = async () => {
        const response = await ApiService.getDoctores();
        const doctoresMap = {};
        response.forEach(doc => {
            doctoresMap[doc.id] = doc.apellidos;
        });
        setDoctores(doctoresMap);
    };

    const fetchCitas = async () => {
        const response = await ApiService.getMisCitas();
        const citasConNombres = response.map(cita => ({
            ...cita,
            apellidos_doctor: doctores[cita.id_doctor] || cita.id_doctor
        }));
        setData(citasConNombres);
        setColumns(["fecha_cita", "hora_cita", "lugar", "apellidos_doctor"]);
    };

    useEffect(() => {
        fetchDoctores();
    }, []);

    useEffect(() => {
        if (Object.keys(doctores).length > 0) {
            fetchCitas();
        }
    }, [doctores]);

    const handleView = (item) => {
        setDataToEdit(item);
        setVisible(true);
        if (onView) onView(item);
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TableDinamic
                columns={columns}
                data={data}
                onView={handleView}
            />

            {visible && dataToEdit && (
                <InfoCard
                    data={dataToEdit}
                    visible={visible}
                    hiddenFields={["id", "updated_at", "created_at", "user_id"]}
                    onClose={() => setVisible(false)}
                />
            )}
        </View>
    );
}