export class ChangelogItem {
  date: Date;
  change: string;
  link: string | undefined;

  constructor(
    date: Date,
    change: string,
    link: string | undefined = undefined
  ) {
    this.date = date;
    this.change = change;
    this.link = link;
  }

  static fromParts(year: number, month: number, day: number, change: string) {
    return new ChangelogItem(new Date(year, month - 1, day), change);
  }
}
