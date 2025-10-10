import React from 'react';
import {View, Text, StyleSheet, Alert, FlatList, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
import CountCard from "../../../../../components/cards/CountCard";
import {useEffect, useState, useMemo} from "react";
import ApiService from "../../../../../Src/services/api/Api";
import DoctorCard from "../../../../../components/cards/DoctorCard";
import AppointmentSlotModal from "./elements/AppointmentSlotModal";

let col = colors;

/**
 * Componente memoizado para los controles de filtro
 * Evita re-renders innecesarios del FlatList
 */
const FilterHeader = React.memo(({ filters, setFilters, uniqueEspecialidades, col, doctoresCount }) => {
    console.log('[FilterHeader] render');
    return (
        <View style={{paddingTop: 20}}>
            <View style={{marginBottom: 10}}>
                <TextInput
                    placeholder="Buscar por nombre"
                    value={filters.nombre}
                    onChangeText={(text) => {
                        console.log('[FilterHeader] onChangeText:', text);
                        setFilters(prev => ({...prev, nombre: text}));
                    }}
                    style={{
                        borderWidth: 1,
                        borderColor: col.text,
                        color: col.text,
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 5
                    }}
                />
                <Picker
                    selectedValue={filters.especialidad}
                    onValueChange={(itemValue) => setFilters(prev => ({...prev, especialidad: itemValue}))}
                    style={{color: col.text, backgroundColor: col.background}}
                >
                    <Picker.Item label="Todas" value="" />
                    {uniqueEspecialidades.map(esp => <Picker.Item key={esp} label={esp} value={esp} />)}
                </Picker>
            </View>
            <View style={styles.container(col)}>
                <CountCard title="Doctores Disponibles" number={doctoresCount} />
            </View>

            <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: col.text,
                textAlign: 'center',
                marginVertical: 15,
                paddingHorizontal: 20
            }}>
                Selecciona un doctor para agendar tu cita
            </Text>
        </View>
    );
});

/**
 * Pantalla de Doctores para Pacientes
 * Permite ver la lista de doctores disponibles y agendar citas
 */
export default function DoctoresMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    const user = useSelector((state) => state.auth.user);
    isDark ? (col = colors) : (col = darkColors);

    const [doctoresCount, setDoctoresCount] = useState(0);
    const [slotModalVisible, setSlotModalVisible] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [doctores, setDoctores] = useState([]);
    const [especialidadesMap, setEspecialidadesMap] = useState({});
    const [filters, setFilters] = useState({ nombre: '', especialidad: '' });
    const [uniqueEspecialidades, setUniqueEspecialidades] = useState([]);

    const filteredDoctores = useMemo(() => {
        let filtered = doctores;
        if (filters.nombre) {
            const search = filters.nombre.toLowerCase();
            filtered = filtered.filter(d =>
                d.nombres.toLowerCase().includes(search) || d.apellidos.toLowerCase().includes(search)
            );
        }
        if (filters.especialidad && filters.especialidad !== 'Todas') {
            filtered = filtered.filter(d => d.especialidad === filters.especialidad);
        }
        return filtered;
    }, [doctores, filters]);


    /**
     * Obtiene la lista de especialidades para filtrar doctores
     */
    const fetchEspecialidades = async () => {
        try {
            console.log('[Paciente - DoctoresMain] Obteniendo especialidades...');
            const response = await ApiService.request('/especialidades');
            const map = {};
            response.forEach(esp => {
                map[esp.id] = esp.nombre;
            });
            setEspecialidadesMap(map);
            console.log('[Paciente - DoctoresMain] Especialidades cargadas:', response);
        } catch (error) {
            console.error('[Paciente - DoctoresMain] Error obteniendo especialidades:', error);
        }
    };

    /**
     * Obtiene la lista de doctores y los enriquece con nombres de especialidades
     */
    const fetchDoctores = async () => {
        try {
            console.log('[Paciente - DoctoresMain] Obteniendo lista de doctores...');
            const response = await ApiService.getDoctores();
            if (Array.isArray(response)) {
                const enriched = response.map(doctor => ({
                    ...doctor,
                    especialidad: especialidadesMap[doctor.id_especialidades] || doctor.id_especialidades
                }));
                setDoctores(enriched);
                const uniqueEsp = [...new Set(enriched.map(d => d.especialidad))];
                setUniqueEspecialidades(uniqueEsp);
                console.log(`[Paciente - DoctoresMain] Total de doctores: ${response.length}`);
            } else {
                console.log('[Paciente - DoctoresMain] Respuesta no es un array');
                setDoctores([]);
                setDoctoresCount(0);
            }
        } catch (error) {
            console.error('[Paciente - DoctoresMain] Error obteniendo lista de doctores:', error);
            setDoctores([]);
            setDoctoresCount(0);
        }
    };


    useEffect(() => {
        console.log('[Paciente - DoctoresMain] Inicializando pantalla de doctores');
        fetchEspecialidades();
    }, []);

    useEffect(() => {
        if (Object.keys(especialidadesMap).length > 0) {
            fetchDoctores();
        }
    }, [especialidadesMap]);


    /**
     * Maneja la selección de un doctor para agendar cita
     */
    const handleAgendarCita = (doctor) => {
        console.log('[Paciente - DoctoresMain] Agendando cita con doctor:', doctor);
        setSelectedDoctor(doctor);
        setSlotModalVisible(true);
    };

    /**
       * Cancela el proceso de agendar cita
       */
      const handleCancel = () => {
           console.log('[Paciente - DoctoresMain] Cancelando agendamiento de cita');
           setSlotModalVisible(false);
           setSelectedDoctor(null);
       };


    return (
        <View style={{ flex: 1, backgroundColor: col.background }}>
            <FlatList
                data={filteredDoctores}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <DoctorCard doctor={item} onAgendarCita={handleAgendarCita} />}
                ListHeaderComponent={<FilterHeader filters={filters} setFilters={setFilters} uniqueEspecialidades={uniqueEspecialidades} col={col} doctoresCount={filteredDoctores.length} />}
                contentContainerStyle={{
                    paddingBottom: "30%",
                    paddingTop: "15%",
                    paddingHorizontal: 20,
                    backgroundColor: col.background
                }}
            />

            <AppointmentSlotModal
                visible={slotModalVisible}
                onClose={handleCancel}
                selectedDoctor={selectedDoctor}
                onSubmit={() => {
                    setSlotModalVisible(false);
                    setSelectedDoctor(null);
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:(col) => ({
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
    }),
});