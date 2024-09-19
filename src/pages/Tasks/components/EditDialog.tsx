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
import { isValidDateString } from '../../../Util';
import LS from '../../../LocalStorage';
import { useAppContext } from '../../../contexts/AppContext';

type EditDialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    task: Task | null;
};

export default function EditDialog({ open, setOpen, task }: EditDialogProps) {
    const reloadTasksFromStorage = useAppContext(s => s.reloadTasksFromStorage);

    const [busy, setBusy] = useState<boolean>(false);
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

    async function handleSave() {
        if (!task) return;

        setBusy(true);

        const freshTask: Task = {
            ...task,
            color,
            description,
            date: DateTime.fromJSDate(date as Date).toFormat('yyyy-LL-dd'),
            updatedAt: DateTime.now().toMillis(),
        };

        const v1 = validate(
            'date',
            isValidDateString(task.date),
            'A valid date is required'
        );

        const v2 = validate(
            'description',
            description.length > 0,
            'Description is required'
        );

        if (v1 && v2) {
            await LS.tasks.updateTask(freshTask);
            await reloadTasksFromStorage();
            setOpen(false);
        }

        setBusy(false);
    }

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
                        onPress={handleSave}
                        mode='contained'
                        style={{ backgroundColor: COLORS[color] }}
                        loading={busy}
                    >
                        Save
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
