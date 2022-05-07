import React, { useEffect, useState } from "react";
import { ChangelogItem } from "../ChangelogItem";
import Parser from "rss-parser";
import { CircularProgress, makeStyles, Typography } from "@material-ui/core";
import { DateTime } from "luxon";

const useStyles = makeStyles((theme) => ({
  updates: {
    display: "inline",
  },
  list: {
    paddingLeft: theme.spacing(3),
    marginTop: 0,
  },
}));

type CustomFeed = {};
type CustomItem = {
  pubDate: string;
  contentSnippet: string;
};

const parser: Parser<CustomFeed, CustomItem> = new Parser({});

export function Changelog() {
  const [changelogs, setChangelogs] = useState<ChangelogItem[]>([
    ChangelogItem.fromParts(2020, 4, 24, "added #poll"),
    ChangelogItem.fromParts(2020, 4, 20, "reskin"),
    ChangelogItem.fromParts(2020, 4, 15, "added #splat + dev tutorial"),
    ChangelogItem.fromParts(2019, 11, 17, "added #reaction"),
    ChangelogItem.fromParts(2019, 6, 3, "added auto-arrange to #ideawall"),
    ChangelogItem.fromParts(
      2019,
      5,
      29,
      "fixed chart overflow in #yesnomaybe, #doggosvskittehs"
    ),
    ChangelogItem.fromParts(2019, 5, 7, "added #broadcast"),
    ChangelogItem.fromParts(2019, 5, 4, "added score to #pong"),
    ChangelogItem.fromParts(2019, 4, 2, "added #ideawall"),
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function readFeed() {
      const feed = await parser.parseURL(
        "https://staffordwilliams.com/devlog/digital-icebreakers.xml"
      );

      const changes = feed.items
        .map((entry) => {
          const date = new Date(entry.pubDate);
          const change = new ChangelogItem(date, entry.title!, entry.link!);
          return change;
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime());

      setChangelogs([...changes, ...changelogs]);
      setIsLoading(false);
    }

    readFeed();
  }, []);
  const classes = useStyles();
  return (
    <div>
      <div>
        <Typography variant="h4" className={classes.updates}>
          Updates
        </Typography>
        <Typography variant="overline">
          <a href="https://devlog.staffordwilliams.com/categories/digitalicebreakers/">
            full
          </a>
        </Typography>
      </div>
      {isLoading && <CircularProgress color="secondary" />}
      <ul className={classes.list}>
        {changelogs.map((item, ix) => (
          <li key={ix}>
            <Typography variant="body1">
              {item.link ? (
                <a href={item.link}>{item.change}</a>
              ) : (
                <span>{item.change}</span>
              )}{" "}
              • {DateTime.fromJSDate(item.date).toRelative()}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}
