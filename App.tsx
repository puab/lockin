import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { AppContextProvider } from './src/contexts/AppContext';
import { Icon, PaperProvider } from 'react-native-paper';
import AppTheme from './src/Theme';
import Toast, { BaseToast } from 'react-native-toast-message';

import HomeScreen from './src/pages/Home';
import JournalScreen from './src/pages/Journal';
import SettingsScreen from './src/pages/Settings';
import TasksScreen from './src/pages/Tasks';
import HabitScreen from './src/pages/Habits';

import './gesture-handler';
import { enGB, registerTranslation } from 'react-native-paper-dates';
registerTranslation('en-GB', enGB);

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import GoalsScreen from './src/pages/Goals';

import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const Drawer = createDrawerNavigator();

export function AppProviders({ children }: { children: any }) {
    return (
        <GestureHandlerRootView>
            <NavigationContainer>
                <AppContextProvider>
                    <PaperProvider theme={AppTheme}>
                        <BottomSheetModalProvider>
                            {children}

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
                                            text2NumberOfLines={2}
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

export default function App() {
    return (
        <AppProviders>
            <Root />
        </AppProviders>
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
