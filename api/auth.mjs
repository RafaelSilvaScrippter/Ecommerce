import { DbConnect } from "../cors/connectDatabase.mjs";
import { Routes } from "../cors/routes.mjs";
import { tableUsers } from "./tables.mjs";

export class Auth {
  constructor() {
    this.dataBase = new DbConnect().dbInit();
    this.init();
    this.rotacionar = new Routes();
  }
  postUser(req, res) {
    res.end("usuarios");
  }

  db() {
    this.dataBase.exec(tableUsers);
  }

  routes(req, res) {
    if (this.rotacionar) {
      this.rotacionar.get("/user", this.postUser(req, res));
    }
  }

  init(req, res) {
    this.db();
    this.routes(req, res);
  }
}
