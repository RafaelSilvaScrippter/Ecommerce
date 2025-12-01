import { DatabaseSync } from "node:sqlite";

export class DbConnect {
  dbInit() {
    const db = new DatabaseSync("./db.sqlite");
    return db;
  }
}
