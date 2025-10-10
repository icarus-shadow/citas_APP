import React, { useState, useEffect } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import { colors, darkColors } from "../../utils/desing/Colors";

export default function DynamicFormModal({
                                             visible,
                                             title = "Formulario",
                                             fields = [],
                                             onSubmit,
                                             onCloses,
                                         }) {
    const initialState = fields.reduce((acc, field) => {
        acc[field.name] = field.type === "select" && field.multiple ? [] : "";
        return acc;
    }, {});

    const [formData, setFormData] = useState(initialState);
    const [activeSelect, setActiveSelect] = useState(null);
    const [passwordVisibility, setPasswordVisibility] = useState({});
    const [timePickerVisible, setTimePickerVisible] = useState(false);
    const [activeTimeField, setActiveTimeField] = useState(null);
    const [selectedHour, setSelectedHour] = useState(12);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState('AM');

    const isDark = useSelector((state) => state.darkMode.value);
    const col = isDark ? colors : darkColors;

    useEffect(() => {
        console.log('[DynamicFormModal] Resetting formData due to fields change');
        setFormData(initialState);
    }, [fields]);

    const handleChange = (name, value, field) => {
        if (field?.type === "select" && field?.multiple) {
            setFormData((prev) => {
                const currentValues = prev[name] || [];
                const valueIndex = currentValues.indexOf(value);
                if (valueIndex === -1) {
                    return { ...prev, [name]: [...currentValues, value] };
                } else {
                    return { ...prev, [name]: currentValues.filter((v) => v !== value) };
                }
            });
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
            if (field?.type === "select") {
                setActiveSelect(null);
            }
        }
    };

    const handleSubmit = () => {
        if (onSubmit) onSubmit(formData);
    };

    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                times.push(timeString);
            }
        }
        return times;
    };

    const openTimePicker = (fieldName) => {
        const currentValue = formData[fieldName];
        if (currentValue) {
            const [hourStr, minuteStr] = currentValue.split(':');
            let hour = parseInt(hourStr);
            const minute = parseInt(minuteStr);

            let period = 'AM';
            if (hour >= 12) {
                period = 'PM';
                if (hour > 12) hour -= 12;
            }
            if (hour === 0) hour = 12;

            setSelectedHour(hour);
            setSelectedMinute(minute);
            setSelectedPeriod(period);
        } else {
            setSelectedHour(12);
            setSelectedMinute(0);
            setSelectedPeriod('AM');
        }

        setActiveTimeField(fieldName);
        setTimePickerVisible(true);
    };

    const handleTimeSelect = () => {
        let hour24 = selectedHour;
        if (selectedPeriod === 'PM' && selectedHour !== 12) {
            hour24 += 12;
        } else if (selectedPeriod === 'AM' && selectedHour === 12) {
            hour24 = 0;
        }

        const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
        handleChange(activeTimeField, timeString);
        setTimePickerVisible(false);
        setActiveTimeField(null);
    };

    const formatTimeDisplay = (timeString) => {
        if (!timeString) return "Seleccionar hora...";

        const [hourStr, minuteStr] = timeString.split(':');
        let hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);

        let period = 'AM';
        if (hour >= 12) {
            period = 'PM';
            if (hour > 12) hour -= 12;
        }
        if (hour === 0) hour = 12;

        return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
    };

    return (
        <>
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer(col)}>
                    <Text style={styles.title(col)}>{title}</Text>
                    <ScrollView style={{ maxHeight: 300 }}>
                        {fields.map((field, index) => (
                            <View key={index} style={styles.inputContainer}>
                                <Text style={styles.label(col)}>{field.label}</Text>
                                {field.type === "time" ? (
                                    <TouchableOpacity
                                        style={[styles.input(col), styles.selectContainer]}
                                        onPress={() => openTimePicker(field.name)}
                                    >
                                        <Text style={{color: col.text}}>
                                            {formatTimeDisplay(formData[field.name])}
                                        </Text>
                                    </TouchableOpacity>
                                ) : field.type === "select" ? (
                                    <View>
                                        <TouchableOpacity
                                            style={[styles.input(col), styles.selectContainer]}
                                            onPress={() =>
                                                setActiveSelect(
                                                    activeSelect === field.name ? null : field.name
                                                )
                                            }
                                        >
                                            <Text style={{color: col.text}}>
                                                {field.multiple
                                                    ? (formData[field.name] || [])
                                                    .map(
                                                        (value) =>
                                                            field.options.find((o) => o.value === value)
                                                                ?.label
                                                    )
                                                    .filter(Boolean)
                                                    .join(", ") || "Seleccione..."
                                                    : field.options.find(
                                                    (o) => o.value === formData[field.name]
                                                )?.label || "Seleccione..."}
                                            </Text>
                                        </TouchableOpacity>
                                        {activeSelect === field.name && (
                                            <View style={styles.optionsContainer(col)}>
                                                {field.options.map((option, i) => {
                                                    const isSelected = field.multiple
                                                        ? (formData[field.name] || []).includes(
                                                            option.value
                                                        )
                                                        : formData[field.name] === option.value;
                                                    return (
                                                        <TouchableOpacity
                                                            key={i}
                                                            style={[
                                                                styles.optionItem,
                                                                isSelected && styles.optionSelected(col),
                                                            ]}
                                                            onPress={() => handleChange(field.name, option.value, field)}
                                                        >
                                                            <Text
                                                                style={{
                                                                    color: isSelected ? col.background : col.text,
                                                                    fontWeight: isSelected ? "bold" : "normal",
                                                                }}
                                                            >
                                                                {option.label}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        )}
                                    </View>
                                ) : field.type === "custom" ? (
                                    <View>
                                        {field.component && React.createElement(field.component, {
                                            ...field.props,
                                            formData,
                                            onChange: (name, value) => handleChange(name, value, field)
                                        })}
                                    </View>
                                ) : (
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={[
                                                styles.input(col),
                                                field.type === "textarea" && {
                                                    height: 100,
                                                    textAlignVertical: "top",
                                                },
                                            ]}
                                            placeholder={field.placeholder || ""}
                                            placeholderTextColor={col.textResalt}
                                            secureTextEntry={field.secure ? !passwordVisibility[field.name] : false}
                                            keyboardType={
                                                field.type === "number"
                                                    ? "numeric"
                                                    : field.type === "email"
                                                        ? "email-address"
                                                        : field.keyboard || "default"
                                            }
                                            multiline={field.type === "textarea"}
                                            numberOfLines={field.type === "textarea" ? 4 : 1}
                                            value={formData[field.name]}
                                            onChangeText={(text) => {
                                                let value = text;
                                                if (field.type === "number") {
                                                    value = text.replace(/[^0-9]/g, "");
                                                }
                                                handleChange(field.name, value);
                                            }}
                                        />
                                        {field.secure && (
                                            <TouchableOpacity
                                                style={styles.eyeButton}
                                                onPress={() => setPasswordVisibility(prev => ({...prev, [field.name]: !prev[field.name]}))}
                                            >
                                                <Ionicons name={passwordVisibility[field.name] ? "eye-off" : "eye"} size={20} color={col.text} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.btn, styles.cancelBtn(col)]}
                            onPress={onCloses}
                        >
                            <Text style={styles.btnText(col)}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.submitBtn(col)]}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.btnText(col)}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>

        <Modal transparent visible={timePickerVisible} animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.modalContainer(col), { maxHeight: 400 }]}>
                    <Text style={styles.title(col)}>Seleccionar Hora</Text>

                    <View style={styles.timePickerContainer}>
                        {/* Hour Selector */}
                        <View style={styles.timeColumn}>
                            <Text style={[styles.timeLabel(col)]}>Hora</Text>
                            <FlatList
                                data={Array.from({length: 12}, (_, i) => i + 1)}
                                keyExtractor={(item) => item.toString()}
                                showsVerticalScrollIndicator={false}
                                style={styles.timeList}
                                getItemLayout={(data, index) => ({ length: 50, offset: 50 * index, index })}
                                initialScrollIndex={selectedHour - 1}
                                onScrollToIndexFailed={() => {}}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.timeItem,
                                            selectedHour === item && styles.timeItemSelected(col)
                                        ]}
                                        onPress={() => setSelectedHour(item)}
                                    >
                                        <Text style={[
                                            styles.timeText(col),
                                            selectedHour === item && styles.timeTextSelected
                                        ]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                        {/* Minute Selector */}
                        <View style={styles.timeColumn}>
                            <Text style={[styles.timeLabel(col)]}>Minuto</Text>
                            <FlatList
                                data={[0, 30]}
                                keyExtractor={(item) => item.toString()}
                                showsVerticalScrollIndicator={false}
                                style={styles.timeList}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.timeItem,
                                            selectedMinute === item && styles.timeItemSelected(col)
                                        ]}
                                        onPress={() => setSelectedMinute(item)}
                                    >
                                        <Text style={[
                                            styles.timeText(col),
                                            selectedMinute === item && styles.timeTextSelected
                                        ]}>
                                            {item.toString().padStart(2, '0')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                        {/* AM/PM Selector */}
                        <View style={styles.timeColumn}>
                            <Text style={[styles.timeLabel(col)]}>Periodo</Text>
                            <View style={styles.periodContainer}>
                                {['AM', 'PM'].map((period) => (
                                    <TouchableOpacity
                                        key={period}
                                        style={[
                                            styles.periodItem,
                                            selectedPeriod === period && styles.periodItemSelected(col)
                                        ]}
                                        onPress={() => setSelectedPeriod(period)}
                                    >
                                        <Text style={[
                                            styles.periodText(col),
                                            selectedPeriod === period && styles.periodTextSelected
                                        ]}>
                                            {period}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.btn, styles.cancelBtn(col)]}
                            onPress={() => setTimePickerVisible(false)}
                        >
                            <Text style={styles.btnText(col)}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.submitBtn(col)]}
                            onPress={handleTimeSelect}
                        >
                            <Text style={styles.btnText(col)}>Seleccionar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    selectContainer: {
        justifyContent: "center",
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: (col) => ({
        width: "85%",
        backgroundColor: col.background,
        borderRadius: 12,
        padding: 20,
        elevation: 10,
    }),
    title: (col) => ({
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        color: col.text,
    }),
    inputContainer: { marginBottom: 12 },
    inputWrapper: { position: 'relative' },
    label: (col) => ({ fontSize: 14, marginBottom: 5, color: col.text }),
    input: (col) => ({
        borderWidth: 1,
        borderColor: col.textResalt,
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
        backgroundColor: col.background,
        color: col.text,
    }),
    eyeButton: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -12 }],
        padding: 5,
    },
    optionsContainer: (col) => ({
        marginTop: 5,
        borderWidth: 1,
        borderColor: col.textResalt,
        borderRadius: 8,
        backgroundColor: col.backgroundResalt,
    }),
    optionItem: {
        padding: 10,
    },
    optionSelected: (col) => ({
        backgroundColor: col.primary,
    }),
    actions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 15,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginLeft: 10,
    },
    cancelBtn: (col) => ({ backgroundColor: col.secondary }),
    submitBtn: (col) => ({ backgroundColor: col.primary }),
    btnText: (col) => ({ color: col.background, fontWeight: "bold" }),
    timePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    timeColumn: {
        alignItems: 'center',
        flex: 1,
    },
    timeLabel: (col) => ({
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: col.text,
    }),
    timeList: {
        height: 150,
    },
    timeItem: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 2,
    },
    timeItemSelected: (col) => ({
        backgroundColor: col.primary,
    }),
    timeText: (col) => ({
        fontSize: 18,
        color: col.text,
    }),
    timeTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    periodContainer: {
        height: 150,
        justifyContent: 'center',
    },
    periodItem: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginVertical: 2,
    },
    periodItemSelected: (col) => ({
        backgroundColor: col.primary,
    }),
    periodText: (col) => ({
        fontSize: 18,
        color: col.text,
    }),
    periodTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
});