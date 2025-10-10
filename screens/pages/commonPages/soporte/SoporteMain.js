/**
 * SoporteMain.js - Componente principal para la página de soporte
 *
 * Este componente permite a los usuarios contactar a administradores para soporte.
 * Muestra una lista de administradores disponibles y permite enviar quejas por correo electrónico.
 *
 * Funcionalidades principales:
 * - Obtener lista de administradores desde la API
 * - Mostrar administradores en una lista desplazable
 * - Permitir envío de quejas por correo electrónico
 * - Soporte para modo oscuro/claro
 * - Manejo de estados de carga y error
 */

// Importaciones de React y hooks
import React, { useState, useEffect } from 'react';
// Importaciones de componentes de React Native para la interfaz de usuario
import { View, Text, FlatList, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
// Hook de Redux para acceder al estado global (modo oscuro)
import { useSelector } from 'react-redux';
// Importación de colores para temas claro y oscuro
import { colors, darkColors } from '../../../../utils/desing/Colors';
// Servicio de API para realizar llamadas al backend
import ApiService from '../../../../Src/services/api/Api';

// Variable global para almacenar los colores actuales del tema
// Se actualiza dinámicamente según el estado del modo oscuro
let col = colors;

/**
 * Componente principal SoporteMain
 *
 * Renderiza la pantalla de soporte que permite a los usuarios contactar administradores.
 * Utiliza estado local para manejar datos de administradores, carga y errores.
 * Implementa soporte completo para temas oscuro y claro.
 */
export default function SoporteMain() {
    // Estado global: Obtener el estado del modo oscuro desde Redux
    // useSelector permite acceder al estado global sin necesidad de props
    const isDark = useSelector((state) => state.darkMode.value);

    // Lógica de selección de colores: Si está en modo oscuro, usar colores oscuros, sino colores claros
    // Esta asignación condicional permite cambiar dinámicamente los colores de la interfaz
    isDark ? (col = colors) : (col = darkColors);

    // Estados locales para manejar el ciclo de vida del componente

    // Estado para almacenar la lista de administradores obtenidos de la API
    // Inicialmente vacío, se llena con datos del servidor
    const [admins, setAdmins] = useState([]);

    // Estado para controlar la visualización del indicador de carga
    // Inicialmente true para mostrar carga mientras se obtienen datos
    const [loading, setLoading] = useState(true);

    // Estado para almacenar mensajes de error en caso de fallos en la API
    // null indica que no hay errores, string contiene el mensaje de error
    const [error, setError] = useState(null);

    // Hook useEffect: Se ejecuta una vez al montar el componente
    // Llama a fetchAdmins para obtener la lista inicial de administradores
    // El array vacío [] asegura que solo se ejecute una vez (al montar)
    useEffect(() => {
        fetchAdmins();
    }, []);

    /**
     * Función asíncrona para obtener la lista de administradores desde la API
     *
     * Realiza una llamada al servicio de API para obtener administradores de soporte.
     * Maneja errores y actualiza los estados correspondientes.
     * Utiliza try-catch-finally para manejo robusto de errores.
     */
    const fetchAdmins = async () => {
        try {
            // Log para debugging: Indica el inicio de la obtención de datos
            console.log('[SoporteMain] Obteniendo lista de administradores para soporte...');

            // Llamada a la API: Utiliza el métdo getSupportAdmins del servicio ApiService
            // Esta llamada incluye automáticamente el token de autenticación si existe
            const response = await ApiService.getSupportAdmins();

            // Validación de respuesta: Verificar que la respuesta sea un array válido
            // Esto previene errores si la API devuelve un formato inesperado
            if (Array.isArray(response)) {
                // Actualizar estado: Establecer la lista de administradores
                setAdmins(response);
                // Log informativo: Mostrar cantidad de administradores obtenidos
                console.log(`[SoporteMain] Total de administradores: ${response.length}`);
            } else {
                // Manejo de respuesta inválida: Log de advertencia y establecer array vacío
                console.log('[SoporteMain] Respuesta no es un array');
                setAdmins([]);
            }
        } catch (err) {
            // Manejo de errores: Capturar cualquier error de la API o red
            console.error('[SoporteMain] Error obteniendo administradores:', err);
            // Actualizar estado de error: Mostrar mensaje de error al usuario
            setError(err.message || 'Error al cargar administradores');
        } finally {
            // Siempre ejecutar: Cambiar estado de carga a false, independientemente del resultado
            // Esto asegura que el indicador de carga desaparezca
            setLoading(false);
        }
    };

    /**
     * Función para manejar el envío de quejas por correo electrónico
     *
     * Crea una URL mailto con el email del administrador y abre la aplicación de correo.
     * Incluye asunto y cuerpo predefinidos para facilitar el envío de quejas.
     *
     * @param {string} email - Email del administrador al que se enviará la queja
     */
    const handleSendComplaint = (email) => {
        // Construir URL mailto con parámetros: destinatario, asunto y cuerpo
        // El formato mailto permite abrir directamente la aplicación de correo del dispositivo
        const url = `mailto:${email}?subject=Queja&body=Escribe tu queja aquí`;

        // Intentar abrir la URL: Si hay una aplicación de correo configurada, se abrirá
        // El métdo catch maneja el caso donde no hay aplicación de correo disponible
        Linking.openURL(url).catch(() => {
            // Mostrar alerta nativa si falla la apertura de la aplicación de correo
            Alert.alert('Error', 'No se pudo abrir la aplicación de correo');
        });
    };

    /**
     * Función de renderizado para cada elemento de administrador en la FlatList
     *
     * Renderiza una tarjeta individual para cada administrador con su información
     * y un botón para enviar quejas. Utiliza estilos responsivos y tema dinámico.
     *
     * @param {Object} item - Objeto administrador con propiedades: id, nombres, apellidos, email
     * @returns {JSX.Element} Componente View con la información del administrador
     */
    const renderAdmin = ({ item }) => (
        // Contenedor principal de la tarjeta del administrador
        // Utiliza colores dinámicos del tema y estilos para crear una tarjeta elevada
        <View style={{
            backgroundColor: col.cardBackground, // Color de fondo de la tarjeta según el tema
            padding: 15, // Espaciado interno de 15 unidades
            marginVertical: 5, // Margen vertical de 5 unidades entre tarjetas
            marginHorizontal: 20, // Margen horizontal de 20 unidades para centrar
            borderRadius: 10, // Bordes redondeados de 10 unidades
            // Sombras para efecto de elevación (iOS y Android)
            shadowColor: '#000', // Color de la sombra
            shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
            shadowOpacity: 0.1, // Opacidad de la sombra
            shadowRadius: 4, // Radio de difuminado de la sombra
            elevation: 3, // Elevación para Android
        }}>
            {/* Nombre completo del administrador */}
            <Text style={{
                fontSize: 18, // Tamaño de fuente grande para el nombre
                fontWeight: 'bold', // Texto en negrita
                color: col.text, // Color del texto según el tema
                marginBottom: 5, // Margen inferior pequeño
            }}>
                {item.nombres} {item.apellidos} {/* Concatenación de nombres y apellidos */}
            </Text>

            {/* Email del administrador */}
            <Text style={{
                fontSize: 16, // Tamaño de fuente mediano
                color: col.textSecondary || col.text, // Color secundario o principal si no existe secundario
                marginBottom: 10, // Margen inferior para separar del botón
            }}>
                {item.email} {/* Dirección de correo electrónico */}
            </Text>

            {/* Botón para enviar queja */}
            <TouchableOpacity
                onPress={() => handleSendComplaint(item.email)} // Manejador de presión con email del admin
                style={{
                    backgroundColor: col.primary || '#007bff', // Color primario del tema o azul por defecto
                    padding: 10, // Espaciado interno del botón
                    borderRadius: 5, // Bordes redondeados pequeños
                    alignItems: 'center', // Centrar contenido horizontalmente
                }}
            >
                <Text style={{
                    color: '#fff', // Texto blanco para contraste
                    fontWeight: 'bold', // Texto en negrita
                }}>
                    Enviar Queja {/* Texto del botón */}
                </Text>
            </TouchableOpacity>
        </View>
    );

    // Estado de carga: Mostrar indicador de carga mientras se obtienen los datos
    // Se renderiza cuando loading es true (estado inicial)
    if (loading) {
        return (
            // Contenedor centrado que ocupa toda la pantalla
            <View style={{
                flex: 1, // Ocupar todo el espacio disponible
                justifyContent: 'center', // Centrar verticalmente
                alignItems: 'center', // Centrar horizontalmente
                backgroundColor: col.background, // Color de fondo según el tema
            }}>
                {/* Indicador de carga nativo de React Native */}
                <ActivityIndicator size="large" color={col.primary || '#007bff'} />
                {/* Texto informativo durante la carga */}
                <Text style={{ color: col.text, marginTop: 10 }}>Cargando administradores...</Text>
            </View>
        );
    }

    // Estado de error: Mostrar mensaje de error y opción de reintentar
    // Se renderiza cuando hay un error en la obtención de datos
    if (error) {
        return (
            // Contenedor centrado con padding horizontal para mejor legibilidad
            <View style={{
                flex: 1, // Ocupar toda la pantalla
                justifyContent: 'center', // Centrar contenido verticalmente
                alignItems: 'center', // Centrar contenido horizontalmente
                backgroundColor: col.background, // Color de fondo del tema
                paddingHorizontal: 20, // Padding horizontal de 20 unidades
            }}>
                {/* Mensaje de error con estilos para mejor presentación */}
                <Text style={{
                    color: col.text, // Color del texto según el tema
                    fontSize: 16, // Tamaño de fuente mediano
                    textAlign: 'center', // Alineación centrada
                    marginBottom: 20, // Margen inferior para separar del botón
                }}>
                    Error: {error} {/* Mostrar el mensaje de error específico */}
                </Text>
                {/* Botón para reintentar la carga de datos */}
                <TouchableOpacity
                    onPress={fetchAdmins} // Llamar nuevamente a fetchAdmins al presionar
                    style={{
                        backgroundColor: col.primary || '#007bff', // Color primario del tema
                        padding: 10, // Espaciado interno
                        borderRadius: 5, // Bordes redondeados
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Renderizado principal: Lista de administradores con FlatList
    // Se ejecuta cuando no hay carga ni error (estado normal de la aplicación)
    return (
        // Contenedor principal que ocupa toda la pantalla
        <View style={{ flex: 1, backgroundColor: col.background }}>
            {/* FlatList para renderizar la lista de administradores de forma eficiente */}
            <FlatList
                data={admins} // Array de administradores obtenido de la API
                keyExtractor={(item) => item.id.toString()} // Función para extraer clave única (id como string)
                renderItem={renderAdmin} // Función de renderizado para cada elemento
                contentContainerStyle={{
                    paddingBottom: "30%", // Padding inferior del 30% para espacio con navegación
                    paddingTop: "15%", // Padding superior del 15% para espacio con header
                    backgroundColor: col.background, // Color de fondo consistente con el tema
                }}
                // Componente de encabezado de la lista
                ListHeaderComponent={
                    <Text style={{
                        fontSize: 20, // Tamaño de fuente grande para el título
                        fontWeight: 'bold', // Texto en negrita
                        color: col.text, // Color del texto según el tema
                        textAlign: 'center', // Alineación centrada
                        marginVertical: 20, // Margen vertical de 20 unidades
                        paddingHorizontal: 20, // Padding horizontal para evitar bordes
                    }}>
                        Contacta a un Administrador {/* Título descriptivo de la sección */}
                    </Text>
                }
                // Componente que se muestra cuando la lista está vacía
                ListEmptyComponent={
                    <Text style={{
                        color: col.text, // Color del texto según el tema
                        fontSize: 16, // Tamaño de fuente mediano
                        textAlign: 'center', // Alineación centrada
                        marginTop: 50, // Margen superior para centrar verticalmente
                        paddingHorizontal: 20, // Padding horizontal para legibilidad
                    }}>
                        No hay administradores disponibles {/* Mensaje cuando no hay datos */}
                    </Text>
                }
            />
        </View>
    );
}