import React, { useEffect, useState } from 'react';
import {View} from 'react-native';
import TableDinamic from "../../../../../../components/TableDinamic";
import ApiService from "../../../../../../Src/services/api/Api";

export default function TableDoctoresPaciente({ onAgendarCita }) {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [especialidades, setEspecialidades] = useState({});

    const fetchEspecialidades = async () => {
        const response = await ApiService.getEspecialidades();
        const especialidadesMap = {};
        response.forEach(esp => {
            especialidadesMap[esp.id] = esp.nombre;
        });
        setEspecialidades(especialidadesMap);
    };

    const fetchDoctores = async () => {
        const response = await ApiService.getDoctores();
        const doctoresConEspecialidad = response.map(doctor => ({
            ...doctor,
            especialidad: especialidades[doctor.id_especialidades] || doctor.id_especialidades
        }));
        setData(doctoresConEspecialidad);
        setColumns(["nombres", "apellidos", "cedula", "especialidad"]);
    };

    useEffect(() => {
        fetchEspecialidades();
    }, []);

    useEffect(() => {
        if (Object.keys(especialidades).length > 0) {
            fetchDoctores();
        }
    }, [especialidades]);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <TableDinamic
                columns={columns}
                data={data}
                onAgendarCita={onAgendarCita}
            />
        </View>
    );
}