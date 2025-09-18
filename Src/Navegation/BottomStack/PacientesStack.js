import CitasMain from "../../../screens/Pages/pacientes/bottomTab/citas/citasM";
import DoctoresMain from "../../../screens/Pages/pacientes/bottomTab/doctores/doctoresM";
import InicioMain from "../../../screens/Pages/pacientes/bottomTab/inicio/inicioM";
import SoporteMain from "../../../screens/Pages/pacientes/bottomTab/soporte/soporteM";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";


const Tab = createBottomTabNavigator();
export default function PacientesBTab() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="citas"
                component={CitasMain}
                options={{title: "citas"}}
            />
            <Tab.Screen
                name="doctores"
                component={DoctoresMain}
                options={{title: "doctores"}}
            />
            <Tab.Screen
                name="inicio"
                component={InicioMain}
                options={{title: "inicio"}}
            />
            <Tab.Screen
                name="soporte"
                component={SoporteMain}
                options={{title: "soporte"}}
            />
        </Tab.Navigator>
    )
}