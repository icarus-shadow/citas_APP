import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Easing } from 'react-native';

const Add = ({onPressed}) => {
    const [hover, setHover] = useState(false);
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.8,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => onPressed()}
                onPressInCapture={() => setHover(true)}
                onPressOutCapture={() => setHover(false)}
                style={[styles.button, hover && styles.buttonHover]}
            >
                {!hover && <Text style={styles.text}>Agregar</Text>}
                <Animated.View style={[styles.icon, hover && styles.iconHover, { transform: [{ scale: scaleAnim }] }]}>
                    <Text style={styles.buttonSpan}>+</Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 150,
        height: 50,
        backgroundColor: '#00a600',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    buttonHover: {
        backgroundColor: '#00a600',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 35,
    },
    icon: {
        position: 'absolute',
        right: 0,
        height: 40,
        width: 40,
        borderLeftWidth: 1,
        borderLeftColor: '#007300',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconHover: {
        width: 150,
        borderLeftWidth: 0,
        left: 0,
    },
    buttonSpan: {
        color: 'white',
        fontSize: 30,
    },
});

export default Add;
