import { DbConnect } from "../cors/connectDatabase.mjs";
import { tableUsers } from "./tables.mjs";

export class Auth {
  constructor() {
    this.dataBase = new DbConnect().dbInit();
    this.init();
  }
  postUser(req, res) {
    res.end("usuarios");
  }

  db() {
    console.log("oi");
    this.dataBase.exec(tableUsers);
  }

  init() {
    this.db();
  }
}
