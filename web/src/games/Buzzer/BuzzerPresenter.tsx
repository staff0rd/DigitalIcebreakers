import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ContentContainer } from "../../components/ContentContainer";
import { ListItemButton } from "@mui/material";
import { useAtom } from "jotai";
import { buzzerAtom } from "./buzzerAtoms";

const BuzzerPresenter = () => {
  const [players] = useAtom(buzzerAtom);

  return (
    <ContentContainer header="Buzzer">
      <List component="nav">
        {players.map((p) => (
          <ListItem key={p.id}>
            <ListItemButton selected={p.state === "down"}>
              {p.name}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </ContentContainer>
  );
};

export default BuzzerPresenter;
