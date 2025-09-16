import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CitasMain from "../../../screens/Pages/pacientes/bottomTab/citas/citasM";
import DoctoresMain from "../../../screens/Pages/pacientes/bottomTab/doctores/doctoresM";
import InicioMain from "../../../screens/Pages/pacientes/bottomTab/inicio/inicioM";
import SoporteMain from "../../../screens/Pages/pacientes/bottomTab/soporte/soporteM";


const Stack = createNativeStackNavigator();
export default function PacientesStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="citas"
                component={CitasMain}
                options={{title: "prestamos"}}
            />
            <Stack.Screen
                name="doctores"
                component={DoctoresMain}
                options={{title: "doctores"}}
            />
            <Stack.Screen
                name="inicio"
                component={InicioMain}
                options={{title: "inicio"}}
            />
            <Stack.Screen
                name="soporte"
                component={SoporteMain}
                options={{title: "soporte"}}
            />
        </Stack.Navigator>
    )
}