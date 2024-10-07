import { useMemo, useState } from 'react';
import BottomSheet from '../../../components/BottomSheet';
import { COLORS, ICONS } from '../../../Theme';
import { StyleSheet, View } from 'react-native';
import HeaderText from '../../../components/HeaderText';
import IconSelector from '../../Habits/components/IconSelector';
import { Button, Divider } from 'react-native-paper';
import ColorSelector from '../../../components/ColorSelector';
import FormTextField from '../../../components/FormTextField';
import useErrorStack from '../../../hooks/useErrorStack';
import { GoalStep } from '../Types';
import GoalStepController from './GoalStepController';

type NewGoalSheetProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
};

export default function NewGoalSheet({ open, setOpen }: NewGoalSheetProps) {
    const { errors, validate } = useErrorStack();

    const [name, setName] = useState<string>('');
    const [reason, setReason] = useState<string>('');
    const [icon, setIcon] = useState<string>(ICONS[0]);
    const [color, setColor] = useState<string>('white');
    const [steps, setSteps] = useState<GoalStep[]>([]);

    const [endAtDate, setEndAtDate] = useState<Date | undefined>(undefined);

    function reset() {}

    function handleCreate() {}

    return (
        <BottomSheet
            open={open}
            setOpen={setOpen}
            handleColor={COLORS[color]}
            onDismiss={reset}
        >
            {useMemo(
                () => (
                    <View style={S.header}>
                        <HeaderText style={{ color: COLORS[color] }}>
                            New goal
                        </HeaderText>

                        <IconSelector
                            value={icon}
                            onChange={setIcon}
                            iconColor={COLORS[color]}
                        />
                    </View>
                ),
                [color, icon]
            )}

            <FormTextField
                label='Name'
                value={name}
                onChange={setName}
                errors={errors.name}
            />

            <FormTextField
                label='Reason (be specific)'
                value={reason}
                onChange={setReason}
                errors={errors.reason}
            />

            <GoalStepController
                value={steps}
                onChange={setSteps}
            />

            <Divider style={{ marginTop: 'auto' }} />

            <ColorSelector
                value={color}
                onChange={setColor}
            />

            <Button
                mode='contained'
                style={{ backgroundColor: COLORS[color] }}
                onPress={handleCreate}
                icon={icon}
            >
                Create
            </Button>
        </BottomSheet>
    );
}

const S = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
