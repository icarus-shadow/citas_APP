import {Text, View} from "react-native";
import {useSelector} from "react-redux";
import {colors, darkColors} from "../../../../../utils/desing/Colors";
let col = colors;


export default function PacientesMain() {
    const isDark = useSelector((state) => state.darkMode.value);
    isDark ? (col = colors) : (col = darkColors);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>
        </View>
    )
}
