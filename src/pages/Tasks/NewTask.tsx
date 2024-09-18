import { Button, Divider, HelperText, Text } from 'react-native-paper';
import PageLayout from '../../components/PageLayout';
import { useEffect, useState } from 'react';
import HeaderBackButton from '../../components/HeaderBackButton';
import FormTextField from '../../components/FormTextField';
import { DatePickerInput } from 'react-native-paper-dates';
import { View } from 'react-native';
import { DateTime } from 'luxon';
import ColorSelector from '../../components/ColorSelector';
import AppTheme, { COLORS } from '../../Theme';
import { Task } from './Types';
import { isValidDateString, uuid } from '../../Util';
import useErrorStack from '../../hooks/useErrorStack';
import { useAppContext } from '../../contexts/AppContext';
import LS from '../../LocalStorage';

export default function NewTaskScreen({ route, navigation }) {
    const reloadTasksFromStorage = useAppContext(s => s.reloadTasksFromStorage);
    const [busy, setBusy] = useState<boolean>(false);
    const { errors, validate } = useErrorStack();

    const currentDateMs = route?.params?.currentDateMs;

    const [date, setDate] = useState<Date | undefined>(
        currentDateMs
            ? DateTime.fromMillis(route.params.currentDateMs).toJSDate()
            : undefined
    );

    useEffect(() => {
        if (currentDateMs) {
            setDate(DateTime.fromMillis(route.params.currentDateMs).toJSDate());
        }
    }, [currentDateMs]);

    const [description, setDescription] = useState<string>('');
    const [color, setColor] = useState<string>('white');

    useEffect(() => {
        navigation?.setOptions({
            headerLeft: () => (
                <HeaderBackButton
                    onPress={() => navigation.navigate('Tasklist')}
                />
            ),
        });
    }, []);

    useEffect(() => {
        navigation?.setOptions({
            headerStyle: {
                backgroundColor: COLORS[color],
            },
        });
    }, [color]);

    async function handleCreate() {
        setBusy(true);

        const task: Task = {
            id: uuid(),
            color,
            description,
            date: DateTime.fromJSDate(date as Date).toFormat('yyyy-LL-dd'),
            completed: false,
            createdAt: DateTime.now().toMillis(),
            updatedAt: DateTime.now().toMillis(),
        };

        const v1 = validate(
            'date',
            !!task.date.match(/^\d{4}-\d{2}-\d{2}$/),
            'Date is required'
        );

        const v2 = validate(
            'description',
            description.length > 0,
            'Description is required'
        );

        if (v1 && v2) {
            await LS.createTask(task);
            await reloadTasksFromStorage();
            navigation.navigate('Tasklist');
            setDate(undefined);
            setDescription('');
            setColor('white');
        }

        setBusy(false);
    }

    return (
        <PageLayout style={{ padding: 10, gap: 10 }}>
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
                        startDate: DateTime.now().minus({ days: 1 }).toJSDate(),
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

            <Divider style={{ marginTop: 'auto' }} />

            <ColorSelector
                value={color}
                onChange={setColor}
            />

            <Button
                mode='contained'
                style={{ backgroundColor: COLORS[color] }}
                loading={busy}
                onPress={handleCreate}
            >
                Create
            </Button>
        </PageLayout>
    );
}
