import {
    Button,
    Dialog,
    HelperText,
    Portal,
    Text,
    TextInput,
} from 'react-native-paper';
import { Task } from '../Types';
import { useEffect, useState } from 'react';
import useErrorStack from '../../../hooks/useErrorStack';
import FormTextField from '../../../components/FormTextField';
import ColorSelector from '../../../components/ColorSelector';
import { StyleSheet, View } from 'react-native';
import AppTheme, { COLORS } from '../../../Theme';
import { DateTime } from 'luxon';
import { DatePickerInput } from 'react-native-paper-dates';

type EditDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    task: Task | null;
};

export default function EditDialog({ open, setOpen, task }: EditDialogProps) {
    const { errors, validate } = useErrorStack();

    const [date, setDate] = useState<Date | undefined>(undefined);
    const [description, setDescription] = useState<string>('');
    const [color, setColor] = useState<string>('');

    useEffect(() => {
        if (task) {
            setDate(DateTime.fromFormat(task.date, 'yyyy-LL-dd').toJSDate());
            setDescription(task.description);
            setColor(task.color);
        }
    }, [task]);

    return (
        <Portal>
            <Dialog
                visible={open}
                onDismiss={() => setOpen(false)}
            >
                <Dialog.Title style={{ color: COLORS[color] }}>
                    Edit task
                </Dialog.Title>
                <Dialog.Content style={S.content}>
                    <View style={{ marginVertical: 30 }}>
                        <DatePickerInput
                            locale='en-GB'
                            label='Date'
                            value={date}
                            onChange={d => setDate(d)}
                            inputMode='start'
                            mode='outlined'
                            startWeekOnMonday={true}
                            presentationStyle='pageSheet'
                            validRange={{
                                startDate: DateTime.now()
                                    .minus({ days: 1 })
                                    .toJSDate(),
                            }}
                            outlineStyle={[
                                errors.date != undefined && {
                                    borderWidth: 2,
                                    borderColor: AppTheme.colors.error,
                                },
                            ]}
                            theme={
                                errors.date != undefined
                                    ? {
                                          colors: {
                                              primary: AppTheme.colors.error,
                                          },
                                      }
                                    : {}
                            }
                        />
                    </View>

                    <View style={{ marginTop: -10 }}>
                        {errors.date?.map((err, idx) => (
                            <HelperText
                                type='error'
                                visible={true}
                                key={`dateerr${idx}`}
                            >
                                {err}
                            </HelperText>
                        ))}
                    </View>

                    <FormTextField
                        label='Description'
                        value={description}
                        onChange={setDescription}
                        errors={errors.description}
                        numberOfLines={5}
                        multiline
                    />
                    <ColorSelector
                        value={color}
                        onChange={setColor}
                    />
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onPress={() => setOpen(false)}
                        mode='contained'
                        style={{ backgroundColor: COLORS[color] }}
                    >
                        Done
                    </Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const S = StyleSheet.create({
    content: {
        gap: 10,
    },
});
