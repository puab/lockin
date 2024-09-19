import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { AppContextProvider } from './contexts/AppContext';
import { DateTime } from 'luxon';
import { Icon, PaperProvider } from 'react-native-paper';
import AppTheme from './Theme';

import HomeScreen from './pages/Home';
import JournalScreen from './pages/Journal';
import AuthScreen from './pages/Auth';
import SettingsScreen from './pages/Settings';
import TasksScreen from './pages/Tasks';
import NewTaskScreen from './pages/Tasks/NewTask';
import HabitScreen from './pages/Habits';

import '../gesture-handler';
import { enGB, registerTranslation } from 'react-native-paper-dates';
registerTranslation('en-GB', enGB);

import HeaderBackButton from './components/HeaderBackButton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NewHabitScreen from './pages/Habits/NewHabit';

const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <GestureHandlerRootView>
            <NavigationContainer>
                <AppContextProvider>
                    <PaperProvider theme={AppTheme}>
                        <Root />
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
                name='New task'
                component={NewTaskScreen}
                options={{
                    headerLeft: () => <HeaderBackButton />,
                    drawerItemStyle: { display: 'none' },
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
                name='New habit'
                component={NewHabitScreen}
                options={{
                    headerLeft: () => <HeaderBackButton />,
                    drawerItemStyle: { display: 'none' },
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

            <Drawer.Screen
                name='Auth'
                component={AuthScreen}
                options={{
                    headerShown: false,
                    drawerItemStyle: { display: 'none' },
                }}
            />
        </Drawer.Navigator>
    );
}
