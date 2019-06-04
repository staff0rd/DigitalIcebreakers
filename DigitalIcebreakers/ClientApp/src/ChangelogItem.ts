export class ChangelogItem {
    date: Date;
    change: string;

    constructor(year: number, month: number, day: number, change: string) {
        this.date = new Date(year, month - 1, day);
        this.change = change;
    }
}