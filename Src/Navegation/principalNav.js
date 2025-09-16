import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';


const tab = createBottomTabNavigator();

export default function PrincipalNav() {
    return (
        <tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: '#da45ad',
                    borderTopWidth: 1,
                    borderTopColor: '#ad4de5',
                    height: 60,
                    paddingBottom: 5,
                    paddingTop: 5,
                },
                tabBarActiveTintColor: 'green',
                tabBarInactiveTintColor: '#4ff5af',
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 2,
                }
            }}
        >
            <tab.Screen
                name={'Inicio'}
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="home" size={size} color={color}/>
                    ),
                    tabBarLabel: 'Inicio',
                }}
            />
            <tab.Screen
                name={'Perfil'}
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="User" size={size} color={color}/>
                    ),
                    tabBarLabel: 'Perfil',
                }}
            />
            <tab.Screen
                name={'Configuración'}
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({color, size}) => (
                        <Ionicons name="Settings-outLine" size={size} color={color}/>
                    ),
                    tabBarLabel: 'Configuración',
                }}
            />
        </tab.Navigator>
    )
}