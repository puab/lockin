import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';

export default function useHeaderRight(component: any, deps?: any[]) {
    const navigation = useNavigation();

    return useEffect(() => {
        navigation?.setOptions({
            headerRight: () => component,
        });
    }, deps);
}
