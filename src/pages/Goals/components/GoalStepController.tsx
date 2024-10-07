import { StyleSheet, View } from 'react-native';
import { Goal, GoalStep } from '../Types';
import { Icon, Menu, Text } from 'react-native-paper';
import AppTheme, { INPUT_CONTAINER_STYLE } from '../../../Theme';
import {
    Gesture,
    GestureDetector,
    ScrollView,
    TouchableOpacity,
} from 'react-native-gesture-handler';
import CreateOrUpdateStepDialog from './CreateOrUpdateStepDialog';
import { useEffect, useRef, useState } from 'react';
import { WEEKDAYS_STR } from '../../../Util';

type GoalStepControllerProps = {
    value: GoalStep[];
    onChange: (step: GoalStep[]) => void;
};

export default function GoalStepController({
    value,
    onChange,
}: GoalStepControllerProps) {
    const [steps, setSteps] = useState<GoalStep[]>(value);
    useEffect(() => onChange(steps), [steps]);

    const [stepDialogOpen, setStepDialogOpen] = useState<boolean>(false);

    function onAdd(step: GoalStep) {
        setSteps([...steps, step]);
    }

    function onUpdate(step: GoalStep) {
        setSteps(curSteps => curSteps.map(s => (s.id === step.id ? step : s)));
    }

    const editTargetRef = useRef<GoalStep | null>(null);
    function wantsDelete(step: GoalStep) {
        setSteps(steps.filter(s => s.id !== step.id));
    }

    function wantsEdit(step: GoalStep) {
        editTargetRef.current = step;
        setStepDialogOpen(true);
    }

    function wantsNewStep() {
        editTargetRef.current = null;
        setStepDialogOpen(true);
    }

    return (
        <>
            <View style={S.container}>
                <Text style={{ marginLeft: 5, fontSize: 16 }}>
                    Steps {steps.length > 0 && `(${steps.length})`}
                </Text>

                <ScrollView
                    style={{ maxHeight: 150 }}
                    contentContainerStyle={{ gap: 5 }}
                >
                    {steps.map((step, idx) => (
                        <GoalStepEntry
                            key={`step-${idx}`}
                            step={step}
                            wantsDelete={wantsDelete}
                            wantsEdit={wantsEdit}
                        />
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={S.newStepBtn}
                    onPress={wantsNewStep}
                >
                    <Icon
                        source={'plus'}
                        size={24}
                        color={AppTheme.colors.primary}
                    />

                    <Text style={{ fontSize: 16 }}>Add a step</Text>
                </TouchableOpacity>
            </View>

            <CreateOrUpdateStepDialog
                open={stepDialogOpen}
                setOpen={setStepDialogOpen}
                onAdd={onAdd}
                onUpdate={onUpdate}
                editTarget={editTargetRef.current}
            />
        </>
    );
}

type GoalStepEntryProps = {
    step: GoalStep;
    wantsEdit: (step: GoalStep) => void;
    wantsDelete: (step: GoalStep) => void;
};

function GoalStepEntry({ step, wantsEdit, wantsDelete }: GoalStepEntryProps) {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const tap = Gesture.Tap()
        .runOnJS(true)
        .onStart(() => setMenuOpen(true));

    const el = (
        <GestureDetector gesture={tap}>
            <View style={S.stepEntry}>
                <View style={S.stepText}>
                    {step.repeat !== false && (
                        <Text
                            style={{
                                fontSize: 14,
                                color: AppTheme.colors.primary,
                            }}
                        >
                            {Array.isArray(step.repeat)
                                ? step.repeat
                                      .map(dayNr =>
                                          WEEKDAYS_STR[dayNr].slice(0, 3)
                                      )
                                      .join(', ')
                                : 'Daily'}
                        </Text>
                    )}

                    <Text style={{ fontSize: 18 }}>{step.name}</Text>

                    {!!step.description && (
                        <Text
                            style={{
                                fontSize: 14,
                                color: 'rgb(175, 175, 175)',
                            }}
                        >
                            {step.description}
                        </Text>
                    )}
                </View>

                {step.showInTaskList && (
                    <View style={{ marginLeft: 'auto' }}>
                        <Icon
                            size={24}
                            source='format-list-checks'
                            color={AppTheme.colors.primary}
                        />
                    </View>
                )}
            </View>
        </GestureDetector>
    );

    return (
        <Menu
            visible={menuOpen}
            onDismiss={() => setMenuOpen(false)}
            mode='elevated'
            anchorPosition='bottom'
            anchor={el}
            style={{ marginLeft: 50 }}
        >
            <Menu.Item
                onPress={() => {
                    setMenuOpen(false);
                    wantsEdit(step);
                }}
                title='Edit'
                leadingIcon='pencil'
            />
            <Menu.Item
                onPress={() => {
                    setMenuOpen(false);
                    wantsDelete(step);
                }}
                title='Delete'
                leadingIcon='delete'
                titleStyle={{ color: 'red' }}
                theme={{ colors: { onSurfaceVariant: 'red' } }}
            />
        </Menu>
    );
}

const S = StyleSheet.create({
    container: {
        gap: 5,
        marginTop: 5,
        padding: 10,
        ...INPUT_CONTAINER_STYLE,
    },
    newStepBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    stepEntry: {
        padding: 5,
        borderLeftWidth: 3,
        borderLeftColor: AppTheme.colors.primary,
        paddingLeft: 5,
        backgroundColor: AppTheme.colors.primaryContainer,
        flexDirection: 'row',
        gap: 5,
    },
    stepText: {},
});
