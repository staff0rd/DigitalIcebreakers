import { useState } from "react";
import doggo from "./doggo.jpeg";
import kitteh from "./kitteh.jpg";
import { useSetAtom } from "jotai";
import { clientMessageAtom } from "../../store/jotai/transportAtoms";
import { List, ListItem, ListItemButton, Box } from "@mui/material";

const DoggosVsKittehsClient = () => {
  const [choice, setChoice] = useState("");
  const sendClientMessage = useSetAtom(clientMessageAtom);

  const choose = (newChoice: string) => {
    setChoice(newChoice);
    sendClientMessage(newChoice);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box component="h2" sx={{ margin: 0 }}>
        Choose one
      </Box>
      <List>
        <ListItem>
          <ListItemButton
            aria-label="Vote for kittehs"
            onClick={() => choose("1")}
            selected={choice === "1"}
            sx={{
              width: 300,
              height: 200,
              background: `url(${kitteh}) no-repeat`,
              backgroundSize: "contain",
              backgroundOrigin: "content-box",
              border: choice === "1" ? "3px solid" : "0px solid",
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemButton
            aria-label="Vote for doggos"
            onClick={() => choose("0")}
            selected={choice === "0"}
            sx={{
              width: 300,
              height: 200,
              background: `url(${doggo}) no-repeat`,
              backgroundSize: "contain",
              backgroundOrigin: "content-box",
              border: choice === "0" ? "3px solid" : "0px solid",
            }}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default DoggosVsKittehsClient;
