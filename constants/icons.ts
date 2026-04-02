import activity from '@/assets/icons/activity.png';
import add from '@/assets/icons/add.png';
import back from '@/assets/icons/back.png';
import forward from '@/assets/icons/forward.png';
import gratitude from '@/assets/icons/gratitude.png';
import home from '@/assets/icons/home.png';
import happy from '@/assets/icons/icon-feliz.png';
import neutral from '@/assets/icons/icon-neutro.png';
import smile from '@/assets/icons/icon-rindo.png';
import sad from '@/assets/icons/icon-triste.png';
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
    happy,
    neutral,
    sad,
    smile,
    forward
} as const;

export type IconKey = keyof typeof icons;