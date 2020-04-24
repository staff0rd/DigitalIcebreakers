 export interface GameMessage<T> {
    payload: T;
    id: string;
    name: string;
}