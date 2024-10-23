import { View } from 'react-native';
import { HelperText, TextInput } from 'react-native-paper';

type FormTextFieldProps = {
    label?: string;
    password?: boolean;
    errors?: string[];
    value?: string;
    onChange?: (text: string) => void;
    numberOfLines?: number;
    multiline?: boolean;
    style?: any;
    disabled?: boolean;
    editable?: boolean;
    right?: React.ReactNode;
};

export default function FormTextField({
    label,
    password,
    errors,
    value,
    onChange,
    numberOfLines,
    multiline,
    style,
    disabled,
    editable,
    right,
}: FormTextFieldProps) {
    return (
        <View style={style}>
            <TextInput
                label={label}
                secureTextEntry={password}
                value={value}
                onChangeText={onChange}
                error={errors?.length != undefined && errors.length > 0}
                mode='outlined'
                numberOfLines={numberOfLines}
                multiline={multiline}
                style={[{ maxHeight: 150 }]}
                disabled={disabled}
                editable={editable}
                right={right}
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
