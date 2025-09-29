import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function goToLogin() {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [
                {
                    name: 'AuthNav',
                    state: {
                        index: 0,
                        routes: [{ name: 'Login' }],
                    },
                },
            ],
        });
    }
}
