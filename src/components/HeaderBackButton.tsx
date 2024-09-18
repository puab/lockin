import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-paper';

export default function HeaderBackButton({
    onPress,
}: {
    onPress?: () => void;
}) {
    return (
        <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={onPress}
        >
            <Icon
                source={'arrow-left'}
                color='black'
                size={24}
            />
        </TouchableOpacity>
    );
}
