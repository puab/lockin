import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FormTextField from '../../../components/FormTextField';
import AppTheme from '../../../Theme';
import { Icon, Text, TextInput } from 'react-native-paper';

type EntryItemControllerProps = {
    value: string[];
    onChange: (value: string[]) => void;
    errors: { [key: string]: string[] };
};

export default function EntryItemController({
    value,
    onChange,
    errors,
}: EntryItemControllerProps) {
    return (
        <View style={S.container}>
            {value.map((item, idx) => (
                <FormTextField
                    key={`ei${idx}`}
                    value={item}
                    label={`Item ${idx + 1}`}
                    onChange={v => {
                        const newItems = [...value];
                        newItems[idx] = v;
                        onChange(newItems);
                    }}
                    right={
                        idx > 2 && (
                            <TextInput.Icon
                                icon='delete'
                                color={'red'}
                                forceTextInputFocus={false}
                                onPress={() =>
                                    onChange(value.filter((_, i) => i !== idx))
                                }
                            />
                        )
                    }
                    errors={errors[`item_${idx}`]}
                />
            ))}

            <TouchableOpacity
                style={S.newItemBtn}
                onPress={() => onChange([...value, ''])}
            >
                <Icon
                    source={'plus'}
                    size={24}
                    color={AppTheme.colors.primary}
                />

                <Text style={{ fontSize: 16 }}>Add an item</Text>
            </TouchableOpacity>
        </View>
    );
}

const S = StyleSheet.create({
    container: {
        gap: 5,
    },
    newItemBtn: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
});
