import { StyleSheet, Text, View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

type FormTextFieldProps = {
    label?: string;
    password?: boolean;
    errors?: string[];
    value?: string;
    onChange?: (text: string) => void;
};

export default function FormTextField({
    label,
    password,
    errors,
    value,
    onChange,
}: FormTextFieldProps) {
    return (
        <View>
            <TextInput
                label={label}
                secureTextEntry={password}
                value={value}
                onChangeText={onChange}
                error={errors?.length != undefined && errors.length > 0}
                mode='outlined'
            />

            {errors?.map((err, idx) => (
                <HelperText
                    type='error'
                    visible={true}
                    key={`err${label}${idx}`}
                >
                    {err}
                </HelperText>
            ))}
        </View>
    );
}
