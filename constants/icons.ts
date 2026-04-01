import activity from '@/assets/icons/activity.png';
import add from '@/assets/icons/add.png';
import back from '@/assets/icons/back.png';
import gratitude from '@/assets/icons/gratitude.png';
import home from '@/assets/icons/home.png';
import meditate from '@/assets/icons/meditate.png';
import mood from '@/assets/icons/mood.png';
import plus from '@/assets/icons/plus.png';

export const icons = {
    activity,
    add,
    back,
    home,
    plus,
    meditate,
    mood,
    gratitude,
} as const;

export type IconKey = keyof typeof icons;