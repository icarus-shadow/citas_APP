import {Text, View} from "react-native";
import {colors, darkColors} from "../../../../../assets/colors";
import {useSelector} from "react-redux";

let col = colors;


export default function InicioMain() {
    const isDark = useSelector((state) => state.boolean.value);
    isDark ? (col = colors) : (col = darkColors);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: col.background}}>
        </View>
    );
}