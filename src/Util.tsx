import { DateTime } from 'luxon';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DateNow = DateTime.now();

export const uuid = () => uuidv4();

export function isValidDateString(dateString: string) {
    if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false;

    return d.toISOString().slice(0, 10) === dateString;
}
