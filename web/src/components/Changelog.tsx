import { useEffect, useState } from "react";
import { ChangelogItem } from "../ChangelogItem";
import { CircularProgress, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
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
      try {
        const response = await fetch(
          "https://staffordwilliams.com/devlog/digital-icebreakers.xml"
        );
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "text/xml");

        const items = xml.querySelectorAll("item");
        const changes = Array.from(items)
          .map((item) => {
            const pubDate = item.querySelector("pubDate")?.textContent || "";
            const title = item.querySelector("title")?.textContent || "";
            const link = item.querySelector("link")?.textContent || "";
            const date = new Date(pubDate);
            return new ChangelogItem(date, title, link);
          })
          .sort((a, b) => b.date.getTime() - a.date.getTime());

        setChangelogs([...changes, ...changelogs]);
      } catch (e) {
        console.error(e);
      }
      setIsLoading(false);
    }

    readFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const classes = useStyles();
  return (
    <div>
      <div>
        <Typography variant="h4" className={classes.updates}>
          Updates
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
