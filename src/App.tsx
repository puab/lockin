import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { AppContextProvider } from './contexts/AppContext';
import { Icon, PaperProvider } from 'react-native-paper';
import AppTheme from './Theme';
import Toast, { BaseToast } from 'react-native-toast-message';

import HomeScreen from './pages/Home';
import JournalScreen from './pages/Journal';
import SettingsScreen from './pages/Settings';
import TasksScreen from './pages/Tasks';
import HabitScreen from './pages/Habits';

import '../gesture-handler';
import { enGB, registerTranslation } from 'react-native-paper-dates';
registerTranslation('en-GB', enGB);

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import GoalsScreen from './pages/Goals';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <GestureHandlerRootView>
            <NavigationContainer>
                <AppContextProvider>
                    <PaperProvider theme={AppTheme}>
                        <BottomSheetModalProvider>
                            <Root />

                            <Toast
                                config={{
                                    success: props => (
                                        <BaseToast
                                            {...props}
                                            style={{
                                                borderLeftColor:
                                                    AppTheme.colors.primary,
                                            }}
                                            contentContainerStyle={{
                                                backgroundColor:
                                                    AppTheme.colors
                                                        .inverseOnSurface,
                                            }}
                                            text1Style={{
                                                color: AppTheme.colors.primary,
                                                fontSize: 18,
                                                fontWeight: 'bold',
                                            }}
                                            text2Style={{
                                                color: 'white',
                                                fontSize: 14,
                                            }}
                                        />
                                    ),
                                }}
                            />
                        </BottomSheetModalProvider>
                    </PaperProvider>
                </AppContextProvider>
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}

function Root() {
    return (
        <Drawer.Navigator
            initialRouteName='Home'
            screenOptions={{
                drawerStyle: {
                    backgroundColor: AppTheme.colors.surface,
                },

                drawerActiveBackgroundColor: AppTheme.colors.inversePrimary,
                drawerInactiveBackgroundColor: AppTheme.colors.onPrimary,
                drawerActiveTintColor: 'white',
                drawerInactiveTintColor: 'white',

                headerStyle: {
                    backgroundColor: AppTheme.colors.primary,
                },
            }}
        >
            <Drawer.Screen
                name='Home'
                component={HomeScreen}
                options={{
                    drawerIcon: ({ color, size, focused }) => (
                        <Icon
                            source={'home'}
                            color={color}
                            size={size}
                        />
                    ),
                    // headerRight: () => <UserMenu />,
                }}
            />

            <Drawer.Screen
                name='Tasklist'
                component={TasksScreen}
                options={{
                    drawerIcon: ({ color, size, focused }) => (
                        <Icon
                            source={'book-check-outline'}
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name='Habits'
                component={HabitScreen}
                options={{
                    drawerIcon: ({ color, size, focused }) => (
                        <Icon
                            source={'format-list-checks'}
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name='Goals'
                component={GoalsScreen}
                options={{
                    drawerIcon: ({ color, size, focused }) => (
                        <Icon
                            source={'flag-checkered'}
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name='Journal'
                component={JournalScreen}
                options={{
                    drawerIcon: ({ color, size, focused }) => (
                        <Icon
                            source={'notebook'}
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />

            <Drawer.Screen
                name='Settings'
                component={SettingsScreen}
                options={{
                    drawerIcon: ({ color, size, focused }) => (
                        <Icon
                            source={'cog'}
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}
