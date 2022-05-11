import { child, get, getDatabase, ref, set } from "firebase/database";

export enum DbRootPath {
  Lobbys = "lobbys",
  Players = "players",
}

export const createLobby = async (args: {
  ownerId: string;
  lobbyId: string;
  name: string;
}) => {
  const db = getDatabase();
  const { ownerId, lobbyId, name } = args;

  await set(ref(db, `${DbRootPath.Lobbys}/${lobbyId}`), {
    players: [],
    ownerId,
    name,
  });

  await set(ref(db, `${DbRootPath.Players}/${ownerId}`), { lobbyId });

  return {
    ownerId,
    lobbyId,
    name,
  };
};

export const getLobbyMembership = async (userId: string) => {
  const db = getDatabase();
  const lobbyId = await get(ref(db, `${DbRootPath.Players}/${userId}/lobbyId`));
  if (lobbyId.exists()) {
    return lobbyId.val();
  }
};

export const getLobby = async (id: string) => {
  const db = ref(getDatabase());
  const result = await get(child(db, `${DbRootPath.Lobbys}/${id}`));
  if (result.exists()) {
    return result.val();
  }
};
