export function between(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(array: T[]) {
    return array[between(0, array.length - 1)];
}
