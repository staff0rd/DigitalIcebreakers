import React, { useEffect, useState } from "react";
import { ChangelogItem } from "../ChangelogItem";
import Moment from "react-moment";
import Parser from "rss-parser";
import { makeStyles, Typography } from "@material-ui/core";

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

  useEffect(() => {
    async function readFeed() {
      const feed = await parser.parseURL(
        "https://devlog.staffordwilliams.com/categories/digitalicebreakers/feed.xml"
      );

      const changes = feed.items.map((entry) => {
        const date = new Date(entry.pubDate);
        const change = new ChangelogItem(date, entry.title!, entry.link!);
        return change;
      });

      setChangelogs([...changes, ...changelogs]);
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
      <ul className={classes.list}>
        {changelogs.map((item, ix) => (
          <li key={ix}>
            <Typography variant="body1">
              {item.link ? (
                <a href={item.link}>{item.change}</a>
              ) : (
                <span>{item.change}</span>
              )}{" "}
              • <Moment fromNow>{item.date.toString()}</Moment>
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}
