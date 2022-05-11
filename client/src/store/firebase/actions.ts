import { createAsyncThunk } from "@reduxjs/toolkit";
import * as db from "./database";

export const createLobby = createAsyncThunk(
  "firebase/createLobby",
  async (args: Parameters<typeof db.createLobby>[0]) => {
    return await db.createLobby(args);
  }
);
