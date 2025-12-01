import { DbConnect } from "../cors/connectDatabase.mjs";
import { Routes } from "../cors/routes.mjs";
import { tableUsers } from "./tables.mjs";

export class Auth {
  constructor(routes) {
    this.rotacionar = routes;
    this.dataBase = new DbConnect().dbInit();
    this.db();
    this.gerenciarRota();
  }
  postLogin(req, res) {
    res.end("usuarios");
  }
  postUserCreate(req, res) {
    res.end("usuários create");
  }

  updateUser(req, res) {
    res.end("usuário update");
  }

  deleteUser(req, res) {
    res.end("usuário deletado");
  }
  resetPassword(req, res) {
    res.end("password resetado");
  }

  db() {
    this.dataBase.exec(tableUsers);
  }

  gerenciarRota(req, res) {
    this.rotacionar.get("/auth/login", this.postLogin);
    this.rotacionar.get("/auth/create", this.postUserCreate);
    this.rotacionar.get("/auth/update", this.updateUser);
    this.rotacionar.get("/auth/delete/user", this.deleteUser);
    this.rotacionar.get("/auth/reset/password", this.resetPassword);
  }
}
