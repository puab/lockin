import { DateTime } from 'luxon';
import * as Haptics from 'expo-haptics';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const DateNow = DateTime.now();
export const DateNowStr = DateNow.toFormat('yyyy-LL-dd');

export const habitDays = (() => {
    const start = DateTime.now();

    return [...new Array(52 * 7)].map((_, idx) => {
        return start.minus({ days: idx }).toFormat('yyyy-LL-dd');
    });
})();

export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7];

export const WEEKDAYS_STR = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
};

export const uuid = () => uuidv4();

export function isValidDateString(dateString: string) {
    if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return false;

    const d = new Date(dateString);
    const dNum = d.getTime();
    if (!dNum && dNum !== 0) return false;

    return d.toISOString().slice(0, 10) === dateString;
}

export const pluralize = (count: number, noun: string, suffix = 's') =>
    `${noun}${count !== 1 ? suffix : ''}`;

export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function secondsToHuman(seconds: number) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let timeString = '';

    if (days > 0) {
        timeString += `${days} day${days > 1 ? 's' : ''}, `;
    }

    if (hours > 0) {
        timeString += `${hours} hour${hours > 1 ? 's' : ''}, `;
    }

    if (minutes > 0) {
        timeString += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return timeString;
}

export function asyncVibrate() {
    return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}
