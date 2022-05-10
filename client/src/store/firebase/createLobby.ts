import { child, get, getDatabase, ref, set } from "firebase/database";
import { sample, range } from "lodash";
import { DbRootPath } from "./DbRootPath";

export const createLobby = async (adminUserId: string, lobbyName: string) => {
  const db = getDatabase();
  const id = getRandomString(4);

  await set(ref(db, `${DbRootPath.Lobbys}/${id}`), {
    players: [],
    ownerId: adminUserId,
    name: lobbyName,
  });

  await set(ref(db, `${DbRootPath.Players}/${adminUserId}`), { lobbyId: id });

  return id;
};

const getRandomString = (length: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return range(0, length)
    .map((p) => sample(chars))
    .join("");
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
