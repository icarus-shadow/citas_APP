import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TouchableOpacity, Text, View, Modal, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useSelector } from "react-redux";
import { colors, darkColors } from "../utils/desing/Colors";

const { width } = Dimensions.get('window');

// Función para calcular los días válidos en un mes/año específico
const getValidDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString().padStart(2, '0'));
};

const getDaysInMonth = (year, month) => getValidDaysInMonth(year, month).concat(['', '']);

const DatePickerComponent = ({ formData, name, onChange }) => {
    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ?  colors : darkColors;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

    // Estados para los índices seleccionados
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
    const [selectedYearIndex, setSelectedYearIndex] = useState(0);

    // Refs para los FlatList
    const dayListRef = useRef(null);
    const monthListRef = useRef(null);
    const yearListRef = useRef(null);

    // Generar arrays de datos infinitos
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).concat(['', '']), []);
    const currentYear = new Date().getFullYear();
    const years = useMemo(() => Array.from({ length: 100 }, (_, i) => (currentYear - 97 + i).toString()), []);

    // Estado para días dinámicos
    const [days, setDays] = useState(getDaysInMonth(currentYear, 1));

    // Actualizar días cuando cambie el mes o año
    useEffect(() => {
        console.log('useEffect 1 ejecutándose: selectedMonthIndex:', selectedMonthIndex, 'selectedYearIndex:', selectedYearIndex);
        const selectedYear = parseInt(years[selectedYearIndex]);
        const selectedMonth = parseInt(months[selectedMonthIndex]);
        const newDays = getDaysInMonth(selectedYear, selectedMonth);
        console.log('Nuevos días calculados:', newDays.length);
        setDays(newDays);

        // Ajustar el índice del día si es mayor que los días disponibles
        if (selectedDayIndex >= newDays.length) {
            console.log('Ajustando selectedDayIndex de', selectedDayIndex, 'a', newDays.length - 1);
            setSelectedDayIndex(newDays.length - 1);
        }
    }, [selectedMonthIndex, selectedYearIndex, years, months, selectedDayIndex]);

    useEffect(() => {
        console.log('useEffect 2 ejecutándose: formData[name]:', formData[name], 'name:', name);
        if (formData[name]) {
            console.log('Estableciendo selectedDate con formData[name]:', formData[name]);
            setSelectedDate(formData[name]);
            initializeIndices(formData[name]);
        } else {
            // Inicializar con fecha actual
            const today = new Date();
            const initialDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
            console.log('Estableciendo selectedDate con fecha actual:', initialDate);
            setSelectedDate(initialDate);
            initializeIndices(initialDate);
        }
    }, [formData[name], name, initializeIndices]);

    const initializeIndices = useCallback((dateString) => {
        console.log('initializeIndices llamado con dateString:', dateString);
        const [year, month, day] = dateString.split('-').map(Number);
        const monthIndex = months.indexOf(month.toString().padStart(2, '0'));
        const yearIndex = years.indexOf(year.toString());

        console.log('Estableciendo selectedMonthIndex:', monthIndex >= 0 ? monthIndex : 0);
        setSelectedMonthIndex(monthIndex >= 0 ? monthIndex : 0);
        console.log('Estableciendo selectedYearIndex:', yearIndex >= 0 ? yearIndex : 0);
        setSelectedYearIndex(yearIndex >= 0 ? yearIndex : 0);

        // Actualizar días primero, luego ajustar el día
        const newDays = getDaysInMonth(year, month);
        console.log('Actualizando días en initializeIndices:', newDays.length);
        setDays(newDays);
        const dayIndex = newDays.indexOf(day.toString().padStart(2, '0'));
        console.log('Estableciendo selectedDayIndex:', dayIndex >= 0 ? dayIndex : 0);
        setSelectedDayIndex(dayIndex >= 0 ? dayIndex : 0);
    }, [months, years]);

    const handlePress = () => {
        setModalVisible(true);
    };

    const handleCancel = () => {
        setModalVisible(false);
        // Resetear a la fecha original
        if (formData[name]) {
            initializeIndices(formData[name]);
        }
    };

    const handleAccept = () => {
        const day = days[selectedDayIndex];
        const month = months[selectedMonthIndex];
        const year = years[selectedYearIndex];
        const formattedDate = `${year}-${month}-${day}`;
        setSelectedDate(formattedDate);
        onChange(name, formattedDate);
        setModalVisible(false);
    };

    const renderItem = ({ item, index }, selectedIndex) => (
        <View style={[styles.pickerItem, index === selectedIndex && { backgroundColor: col.primary }]}>
            <Text style={[styles.pickerText, index === selectedIndex && { color: col.background, fontWeight: 'bold' }]}>
                {item || ' '}
            </Text>
        </View>
    );

    const handleScroll = (event, setIndex, arrayLength) => {
        const y = event.nativeEvent.contentOffset.y;
        let index = Math.round(y / 50);
        index = Math.max(0, Math.min(index, arrayLength - 1));
        setIndex(index);
    };

    const styles = StyleSheet.create({
        input: {
            borderWidth: 1,
            borderColor: col.textResalt,
            borderRadius: 8,
            padding: 10,
            fontSize: 14,
            backgroundColor: col.background,
            color: col.text,
        },
        selectContainer: {
            justifyContent: "center",
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: col.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            maxHeight: '50%',
        },
        pickerContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginBottom: 20,
        },
        pickerColumn: {
            width: width / 3 - 20,
            height: 200,
        },
        pickerItem: {
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            marginVertical: 0,
        },
        pickerText: {
            fontSize: 18,
            color: col.text,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        button: {
            flex: 1,
            padding: 15,
            borderRadius: 8,
            marginHorizontal: 5,
        },
        cancelButton: {
            backgroundColor: col.textResalt,
        },
        acceptButton: {
            backgroundColor: col.primary,
        },
        buttonText: {
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    return (
        <View>
            <TouchableOpacity
                style={[styles.input, styles.selectContainer]}
                onPress={handlePress}
            >
                <Text style={{ color: col.text }}>
                    {selectedDate ? selectedDate : 'Seleccionar fecha...'}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCancel}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.pickerContainer}>
                            <View style={styles.pickerColumn}>
                                <Text style={[styles.pickerText, { textAlign: 'center', marginBottom: 10 }]}>Día</Text>
                                <FlatList
                                    ref={dayListRef}
                                    data={days}
                                    renderItem={(props) => renderItem(props, selectedDayIndex)}
                                    keyExtractor={(item, index) => `${item}-${index}`}
                                    showsVerticalScrollIndicator={false}
                                    snapToInterval={50}
                                    decelerationRate="fast"
                                    initialScrollIndex={selectedDayIndex}
                                    getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
                                    onMomentumScrollEnd={(event) => handleScroll(event, setSelectedDayIndex, days.length)}
                                />
                            </View>
                            <View style={styles.pickerColumn}>
                                <Text style={[styles.pickerText, { textAlign: 'center', marginBottom: 10 }]}>Mes</Text>
                                <FlatList
                                    ref={monthListRef}
                                    data={months}
                                    renderItem={(props) => renderItem(props, selectedMonthIndex)}
                                    keyExtractor={(item, index) => `${item}-${index}`}
                                    showsVerticalScrollIndicator={false}
                                    snapToInterval={50}
                                    decelerationRate="fast"
                                    initialScrollIndex={selectedMonthIndex}
                                    getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
                                    onMomentumScrollEnd={(event) => handleScroll(event, setSelectedMonthIndex, months.length)}
                                />
                            </View>
                            <View style={styles.pickerColumn}>
                                <Text style={[styles.pickerText, { textAlign: 'center', marginBottom: 10 }]}>Año</Text>
                                <FlatList
                                    ref={yearListRef}
                                    data={years}
                                    renderItem={(props) => renderItem(props, selectedYearIndex)}
                                    keyExtractor={(item, index) => `${item}-${index}`}
                                    showsVerticalScrollIndicator={false}
                                    snapToInterval={50}
                                    decelerationRate="fast"
                                    initialScrollIndex={selectedYearIndex}
                                    getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
                                    onMomentumScrollEnd={(event) => handleScroll(event, setSelectedYearIndex, years.length)}
                                />
                            </View>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                                <Text style={[styles.buttonText, { color: col.background }]}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={handleAccept}>
                                <Text style={[styles.buttonText, { color: col.background }]}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DatePickerComponent;