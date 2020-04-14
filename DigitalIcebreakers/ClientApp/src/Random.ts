export function between(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(array: T[]) {
    return array[between(0, array.length - 1)];
}

export function shuffle<T>(a: T[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default {
    between,
    pick,
    shuffle,
}