import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../../screens/Auth/LoginScreen';
import RegisterScreen from '../../screens/Auth/RegisterScreen';


const Stack = createNativeStackNavigator();


export default function AuthNav() {
    return (
        <Stack.Navigator initialRouteName="login">
            <Stack.Screen
                name="login"
                component={LoginScreen}
                options={{title: 'iniciar sesion'}}
            />
            <Stack.Screen
                name="register"
                component={RegisterScreen}
            />
        </Stack.Navigator>
    );
}