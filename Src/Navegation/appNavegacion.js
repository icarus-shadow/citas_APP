import { NavigationContainer } from '@react-navigation/native';
import AuthNav from './authNav';

export default function AppNavegacion() {
    return (
        <NavigationContainer>
            <AuthNav />
        </NavigationContainer>
    );
}