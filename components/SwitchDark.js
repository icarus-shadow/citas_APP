import { useDispatch, useSelector } from "react-redux";
import { Text, View, Pressable } from "react-native";
import { toggle } from "../utils/slices/DarkModeSlice";
import { colors, darkColors } from "../utils/desing/Colors";

let col = colors;


export default function SwitchDark() {
    const value = useSelector((state) => state.darkMode.value);
    const dispatch = useDispatch();
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = darkColors) : (col = colors);

    return (
        <View
            style={{
                backgroundColor: col.backgroundResalt,
                borderRadius: 120,
                position: "absolute",
                top: 40,
                right: 20,
                zIndex: 999,
                padding: 8,
            }}
        >
            <Pressable onPress={() => dispatch(toggle())}>
                <Text style={{ color: col.text, fontSize: 16, fontWeight: "bold" }}>
                    {value ? "🌙" : "🌞"}
                </Text>
            </Pressable>
        </View>
    );
}
