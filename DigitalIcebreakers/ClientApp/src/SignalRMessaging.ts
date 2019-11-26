export interface SignalRMessaging {
    clientMessage: (message: any) => void;
    adminMessage: (message: any) => void;
}