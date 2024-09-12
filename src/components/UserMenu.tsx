import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Menu } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import API from '../API';

export default function UserMenu() {
    const { setUser, nav } = useAuthContext();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    async function handleLogout() {
        await API.logout();
        setUser(null);
        setUserMenuOpen(false);
        nav?.navigate('Auth');
    }

    return (
        <Menu
            visible={userMenuOpen}
            onDismiss={() => setUserMenuOpen(false)}
            anchorPosition='bottom'
            anchor={
                <TouchableOpacity onPress={() => setUserMenuOpen(true)}>
                    <User
                        color='black'
                        size={24}
                        style={{ marginRight: 12 }}
                    />
                </TouchableOpacity>
            }
        >
            <Menu.Item
                onPress={() => nav?.navigate('Settings')}
                leadingIcon={'cog'}
                title='Settings'
            />
            <Menu.Item
                onPress={handleLogout}
                leadingIcon={'logout'}
                title='Log out'
                titleStyle={{ color: 'red' }}
                theme={{ colors: { onSurfaceVariant: 'red' } }}
            />
        </Menu>
    );
}
