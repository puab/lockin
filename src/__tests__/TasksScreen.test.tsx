import TasksScreen from '../pages/Tasks';
import { render, userEvent } from '../test-utils';
import '@testing-library/jest-native';

import { expect, test } from '@jest/globals';

test('Add new task works', async () => {
    const { getByTestId } = render(<TasksScreen />);

    const addItemButton = getByTestId('add-item-button');

    const user = userEvent.setup();
    await user.press(addItemButton);

    const createOrUpdateButton = getByTestId('create-or-update-task-button');

    expect(createOrUpdateButton).toBeOnTheScreen();
});
