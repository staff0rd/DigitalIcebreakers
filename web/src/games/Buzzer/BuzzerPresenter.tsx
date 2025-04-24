import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ContentContainer } from "../../components/ContentContainer";
import { useSelector } from "../../store/useSelector";
import { ListItemButton } from "@mui/material";

const BuzzerPresenter = () => {
  const players = useSelector((state) => state.games.buzzer);

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
